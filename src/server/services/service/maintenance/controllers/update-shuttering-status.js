import Boom from '@hapi/boom'
import Joi from 'joi'

import { waf } from '../../../../common/constants/waf.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { requestShutterUpdate } from '../helpers/fetchers.js'

const updateShutteringStatusController = {
  options: {
    id: 'post:services/{serviceId}/maintenance/shuttering',
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
        serviceName: Joi.string().required(),
        environment: Joi.string().required(),
        waf: Joi.string()
          .valid(...Object.values(waf))
          .required(),
        url: Joi.string().required(),
        shouldShutter: Joi.boolean().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const payload = request.payload
    const shouldShutter = payload.shouldShutter

    const sanitisedPayload = {
      serviceName: payload.serviceName,
      environment: payload.environment,
      waf: payload.waf,
      url: payload.url
    }

    try {
      await requestShutterUpdate(request, sanitisedPayload, shouldShutter)

      request.yar.clear(sessionNames.validationFailure)
      request.yar.flash(sessionNames.notifications, {
        text: `${shouldShutter ? 'Shutter' : 'Unshutter'} requested for https://${sanitisedPayload.url}`,
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
