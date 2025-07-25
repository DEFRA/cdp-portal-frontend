import Boom from '@hapi/boom'
import omit from 'lodash/omit.js'

import { config } from '../../../../../../../config/config.js'
import { sessionNames } from '../../../../../constants/session-names.js'
import { buildErrorDetails } from '../../../../../helpers/build-error-details.js'
import { serviceParamsValidation } from '../../../../../../services/helpers/schema/service-params-validation.js'
import { secretPayloadValidation } from '../schema/secret-payload-validation.js'
import { pluralise } from '../../../../../helpers/pluralise.js'

function updateSecretController(entityType) {
  return {
    options: {
      id: `post:${pluralise(entityType)}/{serviceId}/secrets/{environment}/update`,
      validate: {
        params: serviceParamsValidation,
        failAction: () => Boom.boomify(Boom.badRequest())
      }
    },
    handler: async (request, h) => {
      const params = request.params
      const serviceId = params.serviceId
      const environment = params.environment
      const payload = request.payload
      const secretKey = payload?.secretKey
      const secretValue = payload?.secretValue
      const teamId = payload?.teamId
      const button = payload?.button

      const redirectUrl = request.routeLookup(
        `${pluralise(entityType)}/{serviceId}/secrets/{environment}/update`,
        {
          params: { serviceId, environment },
          query: { secretKey }
        }
      )

      const sanitisedPayload = {
        secretKey,
        secretValue,
        environment,
        teamId,
        button
      }

      const validationResult = secretPayloadValidation(
        button,
        request.auth.credentials?.scope
      ).validate(sanitisedPayload, { abortEarly: false })

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
            payload: omit(sanitisedPayload, ['environment', 'button'])
          })

          request.yar.clear(sessionNames.validationFailure)
          request.yar.flash(sessionNames.notifications, {
            text: 'Secret being created', // TODO should have this in self service ops?
            type: 'success'
          })

          return h.redirect(
            request.routeLookup(
              `${pluralise(entityType)}/{serviceId}/secrets/{environment}`,
              {
                params: { serviceId, environment }
              }
            )
          )
        } catch (error) {
          request.logger.error({ error }, 'Update secret call failed')
          request.yar.flash(sessionNames.validationFailure, {
            formValues: omit(sanitisedPayload, ['button'])
          })
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

export { updateSecretController }
