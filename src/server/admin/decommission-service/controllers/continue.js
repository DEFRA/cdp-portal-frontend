import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { decommissionService } from '~/src/server/admin/decommission-service/helpers/fetch/decommission-service.js'
import { isServiceValid } from '~/src/server/admin/decommission-service/helpers/is-service-valid.js'

export const decommissionContinueController = {
  options: {
    validate: {
      params: Joi.object({
        serviceName: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceName = request.params.serviceName

    const serviceIsValid = await isServiceValid(serviceName, request)

    if (!serviceIsValid) {
      return h.redirect(`/admin/decommission-service/${serviceName}/step-1`)
    }

    try {
      await decommissionService(request, serviceName)

      request.yar.clear(sessionNames.validationFailure)
      await request.yar.commit(h)

      request.yar.flash(sessionNames.notifications, {
        text: 'Service decommissioned successfully so far',
        type: 'success'
      })

      request.logger.info(`Service ${serviceName} decommissioned`)
      return h.redirect(`/admin/decommission-service/${serviceName}/step-2`)
    } catch (error) {
      request.logger.error(`Service ${serviceName} decommissioning failed`)

      request.yar.flash(sessionNames.validationFailure)
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/decommission-service/${serviceName}/step-1`)
    }
  }
}
