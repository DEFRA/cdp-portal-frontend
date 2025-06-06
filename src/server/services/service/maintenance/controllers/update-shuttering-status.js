import Boom from '@hapi/boom'
import Joi from 'joi'

import { waf } from '~/src/server/common/constants/waf.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { requestShutterUpdate } from '~/src/server/services/service/maintenance/helpers/fetchers.js'

const updateShutteringStatusController = {
  options: {
    id: 'post:services/{serviceId}/maintenance/shuttering',
    auth: {
      mode: 'required',
      access: {
        scope: [
          scopes.serviceOwner,
          scopes.admin,
          `+${scopes.restrictedTechMaintenance}`
        ]
      }
    },
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      payload: Joi.object({
        serviceName: Joi.string().required(),
        environment: Joi.string().required(),
        waf: Joi.string()
          .valid(...Object.values(waf))
          .required(),
        url: Joi.string().required(),
        shouldUnshutter: Joi.boolean().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const payload = request.payload
    const shouldUnshutter = payload.shouldUnshutter

    const sanitisedPayload = {
      serviceName: payload.serviceName,
      environment: payload.environment,
      waf: payload.waf,
      url: payload.url
    }

    try {
      await requestShutterUpdate(request, sanitisedPayload, shouldUnshutter)

      request.yar.clear(sessionNames.validationFailure)
      request.yar.flash(sessionNames.notifications, {
        text: `Shutter requested for ${sanitisedPayload.url}`,
        type: 'success'
      })

      request.audit.send({
        event: 'Shutter requested',
        user: {
          id: request.auth.credentials.id,
          name: request.auth.credentials.displayName
        },
        shutterDetail: sanitisedPayload
      })
    } catch (error) {
      request.logger.error({ error }, 'Shutter request failed')
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })
    }

    return h.redirect(
      request.routeLookup('services/{serviceId}/maintenance', {
        params: { serviceId }
      })
    )
  }
}

export { updateShutteringStatusController }
