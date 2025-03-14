import Boom from '@hapi/boom'
import omit from 'lodash/omit.js'

import { config } from '~/src/config/config.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { preProvideService } from '~/src/server/services/helpers/pre/pre-provide-service.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'
import { secretPayloadValidation } from '~/src/server/services/service/secrets/helpers/schema/secret-payload-validation.js'

const updateSecretController = {
  options: {
    id: 'post:services/{serviceId}/secrets/{environment}/update',
    pre: [preProvideService],
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
      'services/{serviceId}/secrets/{environment}/update',
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

      return h.redirect(redirectUrl)
    }

    if (!validationResult.error) {
      const selfServiceOpsAddSecretEndpointUrl =
        config.get('selfServiceOpsUrl') +
        `/secrets/add/${serviceId}/${environment}`

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
          request.routeLookup('services/{serviceId}/secrets/{environment}', {
            params: { serviceId, environment }
          })
        )
      } catch (error) {
        request.logger.debug({ error }, 'Update secret call failed')
        request.yar.flash(sessionNames.validationFailure, {
          formValues: omit(sanitisedPayload, ['button'])
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(redirectUrl)
      }
    }
  }
}

export { updateSecretController }
