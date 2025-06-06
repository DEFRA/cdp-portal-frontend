import Boom from '@hapi/boom'
import Joi from 'joi'

import { scopes } from '~/src/server/common/constants/scopes.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { requestUndeploy } from '~/src/server/services/service/maintenance/helpers/fetchers.js'

const undeployController = {
  options: {
    id: 'post:services/{serviceId}/maintenance/undeploy',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.serviceOwner, scopes.admin]
      }
    },
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      payload: Joi.object({
        environment: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const payload = request.payload

    const sanitisedPayload = {
      serviceName: serviceId,
      environment: payload.environment
    }

    try {
      const { payload } = await requestUndeploy(request, sanitisedPayload)

      request.yar.clear(sessionNames.validationFailure)
      request.yar.flash(sessionNames.notifications, {
        text: `Undeploy requested for ${sanitisedPayload.serviceName}`,
        type: 'success'
      })

      request.audit.send({
        event: 'Undeploy requested',
        user: {
          id: request.auth.credentials.id,
          name: request.auth.credentials.displayName
        },
        undeployDetail: sanitisedPayload
      })

      return h.redirect(
        request.routeLookup('deployments/{environment}/{deploymentId}', {
          params: {
            environment: sanitisedPayload.environment,
            deploymentId: payload?.deploymentId
          }
        })
      )
    } catch (error) {
      request.logger.error({ error }, 'Undeploy request failed')
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })

      return h.redirect(
        request.routeLookup('services/{serviceId}/maintenance', {
          params: { serviceId }
        })
      )
    }
  }
}

export { undeployController }
