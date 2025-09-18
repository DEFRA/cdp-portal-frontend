import Boom from '@hapi/boom'
import omit from 'lodash/omit.js'

import { config } from '../../../../../../../config/config.js'
import { sessionNames } from '../../../../../constants/session-names.js'
import { fetchSecrets } from '../../../../../helpers/fetch/fetch-secrets.js'
import { buildErrorDetails } from '../../../../../helpers/build-error-details.js'
import { serviceParamsValidation } from '../../../../../../services/helpers/schema/service-params-validation.js'
import { secretPayloadValidation } from '../schema/secret-payload-validation.js'
import { pluralise } from '../../../../../helpers/pluralise.js'

function createSecretController(entityKind) {
  return {
    options: {
      id: `${pluralise(entityKind)}/{serviceId}/secrets/{environment}/create`,
      validate: {
        params: serviceParamsValidation,
        failAction: () => Boom.boomify(Boom.badRequest())
      },
      plugins: {
        disinfect: { disinfectPayload: false }
      }
    },
    handler: async (request, h) => {
      const params = request.params
      const serviceId = params.serviceId
      const environment = params.environment
      const payload = request.payload
      const secretKey = payload?.secretKey
      const secretValue = payload?.secretValue
      const button = payload?.button

      const redirectUrl = request.routeLookup(
        `${pluralise(entityKind)}/{serviceId}/secrets/{environment}`,
        {
          params: {
            serviceId,
            environment
          }
        }
      )

      const sanitisedPayload = {
        secretKey,
        secretValue,
        button
      }

      const secrets = await fetchSecrets(environment, serviceId, request.logger)

      const validationResult = secretPayloadValidation(
        button,
        secrets?.keys
      ).validate(sanitisedPayload, {
        abortEarly: false
      })

      if (validationResult?.error) {
        const errorDetails = buildErrorDetails(validationResult.error.details)

        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload,
          formErrors: errorDetails
        })
      } else {
        const selfServiceOpsAddSecretEndpointUrl = `${config.get('selfServiceOpsUrl')}/secrets/add/${serviceId}/${environment}`

        try {
          await request.authedFetchJson(selfServiceOpsAddSecretEndpointUrl, {
            method: 'post',
            payload: omit(sanitisedPayload, ['button'])
          })

          request.yar.clear(sessionNames.validationFailure)
          request.yar.flash(sessionNames.notifications, {
            text: 'Secret being created',
            type: 'success'
          })
        } catch (error) {
          request.logger.error({ error }, 'Create secret call failed')
          request.yar.flash(
            sessionNames.globalValidationFailures,
            error.message
          )
        }
      }
      return h.redirect(redirectUrl)
    }
  }
}

export { createSecretController }
