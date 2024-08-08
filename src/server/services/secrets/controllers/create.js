import Boom from '@hapi/boom'
import { omit } from 'lodash'

import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { secretParamsValidation } from '~/src/server/services/secrets/helpers/schema/secret-params-validation'
import { secretPayloadValidation } from '~/src/server/services/secrets/helpers/schema/secret-payload-validation'

const createSecretController = {
  options: {
    id: 'services/{serviceId}/secrets/{environment}/create',
    pre: [provideService],
    validate: {
      params: secretParamsValidation,
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

    const secrets = await fetchSecrets(environment, serviceId)

    const validationResult = secretPayloadValidation(
      button,
      teamId,
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
        config.get('selfServiceOpsApiUrl') +
        `/secrets/add/${serviceId}/${environment}`

      try {
        const { json, response } = await request.authedFetcher(
          selfServiceOpsAddSecretEndpointUrl,
          {
            method: 'post',
            body: JSON.stringify(
              omit(sanitisedPayload, ['environment', 'button'])
            )
          }
        )

        if (response?.ok) {
          request.yar.clear(sessionNames.validationFailure)
          request.yar.flash(sessionNames.notifications, {
            text: json.message,
            type: 'success'
          })

          return h.redirect(redirectUrl)
        }
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
