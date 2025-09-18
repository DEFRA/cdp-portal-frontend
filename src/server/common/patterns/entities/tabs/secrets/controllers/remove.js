import Boom from '@hapi/boom'

import { config } from '../../../../../../../config/config.js'
import { sessionNames } from '../../../../../constants/session-names.js'
import { fetchSecrets } from '../../../../../helpers/fetch/fetch-secrets.js'
import { serviceParamsValidation } from '../../../../../../services/helpers/schema/service-params-validation.js'
import { removeSecretPayloadValidation } from '../schema/secret-payload-validation.js'
import { pluralise } from '../../../../../helpers/pluralise.js'
import Joi from 'joi'

const immutableKeys = config.get('platformGlobalSecretKeys')

function removeSecretController(entityKind) {
  return {
    options: {
      id: `post:${pluralise(entityKind)}/{serviceId}/secrets/{environment}/remove`,
      validate: {
        params: serviceParamsValidation,
        payload: Joi.object({
          secretKey: Joi.string()
            .not(...immutableKeys)
            .min(1)
            .max(256)
            .required()
        }),
        failAction: () => {
          return Boom.boomify(Boom.badRequest())
        }
      }
    },
    handler: async (request, h) => {
      const params = request.params
      const serviceId = params.serviceId
      const environment = params.environment
      const payload = request.payload
      const secretKey = payload?.secretKey

      const sanitisedPayload = {
        secretKey
      }

      const secrets = await fetchSecrets(environment, serviceId, request.logger)

      const validationResult = removeSecretPayloadValidation(
        secrets?.keys
      ).validate(sanitisedPayload, {
        abortEarly: false
      })

      if (validationResult?.error) {
        request.logger.error(validationResult?.error)
        request.yar.flash(
          sessionNames.globalValidationFailures,
          'Error whilst removing secret'
        )
      } else {
        const selfServiceOpsAddSecretEndpointUrl = `${config.get('selfServiceOpsUrl')}/secrets/remove/${serviceId}/${environment}`

        try {
          await request.authedFetchJson(selfServiceOpsAddSecretEndpointUrl, {
            method: 'post',
            payload: sanitisedPayload
          })

          request.yar.clear(sessionNames.validationFailure)
          request.yar.flash(sessionNames.notifications, {
            text: 'Secret being removed',
            type: 'success'
          })

          return h.redirect(
            request.routeLookup(
              `${pluralise(entityKind)}/{serviceId}/secrets/{environment}`,
              {
                params: { serviceId, environment }
              }
            )
          )
        } catch (error) {
          request.logger.error({ error }, 'Remove secret call failed')
          request.yar.flash(
            sessionNames.globalValidationFailures,
            error.message
          )
        }
      }

      const redirectUrl = request.routeLookup(
        `${pluralise(entityKind)}/{serviceId}/secrets/{environment}/remove`,
        {
          query: { secretKey },
          params: {
            serviceId,
            environment
          }
        }
      )
      return h.redirect(redirectUrl)
    }
  }
}

export { removeSecretController }
