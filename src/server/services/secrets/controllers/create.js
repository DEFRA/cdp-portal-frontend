import Boom from '@hapi/boom'
import omit from 'lodash/omit.js'

import { config } from '~/src/config/config.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets.js'
import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'
import { secretPayloadValidation } from '~/src/server/services/secrets/helpers/schema/secret-payload-validation.js'

const createSecretController = {
  options: {
    id: 'services/{serviceId}/secrets/{environment}/create',
    pre: [provideService],
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
      'services/{serviceId}/secrets/{environment}',
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
      environment,
      teamId,
      button
    }

    const secrets = await fetchSecrets(environment, serviceId, request.logger)

    const validationResult = secretPayloadValidation(
      button,
      request.auth.credentials?.scope,
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

      return h.redirect(redirectUrl)
    }

    if (!validationResult.error) {
      const selfServiceOpsAddSecretEndpointUrl =
        config.get('selfServiceOpsUrl') +
        `/secrets/add/${serviceId}/${environment}`

      try {
        const { payload: createSecretPayload } = await request.authedFetcher(
          selfServiceOpsAddSecretEndpointUrl,
          {
            method: 'post',
            payload: omit(sanitisedPayload, ['environment', 'button'])
          }
        )

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: createSecretPayload.message,
          type: 'success'
        })

        return h.redirect(redirectUrl)
      } catch (error) {
        request.logger.debug({ error }, 'Create secret call failed')
        request.yar.flash(sessionNames.validationFailure, {
          formValues: omit(sanitisedPayload, ['button'])
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(redirectUrl)
      }
    }
  }
}

export { createSecretController }
