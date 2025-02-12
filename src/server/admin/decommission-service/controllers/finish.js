import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { deleteDeploymentFiles } from '~/src/server/admin/decommission-service/helpers/fetch/delete-deployment-files.js'
import { deleteEcs } from '~/src/server/admin/decommission-service/helpers/fetch/delete-ecs.js'
import { isServiceValid } from '~/src/server/admin/decommission-service/helpers/is-service-valid.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'

export const decommissionFinishController = {
  options: {
    pre: [provideAuthedUser],
    validate: {
      params: Joi.object({
        serviceName: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceName = request.params.serviceName
    const authedUser = request.pre.authedUser

    const serviceIsValid = await isServiceValid(serviceName, request)

    if (!serviceIsValid) {
      return h.redirect(`/admin/decommission-service/${serviceName}/step-2`)
    }

    try {
      await Promise.all([
        deleteDeploymentFiles(request, serviceName),
        deleteEcs(request, serviceName)
      ])

      request.yar.clear(sessionNames.validationFailure)
      await request.yar.commit(h)

      request.yar.flash(sessionNames.notifications, {
        text: 'Service decommissioned successfully',
        type: 'success'
      })

      request.audit.sendMessage({
        event: `Service decommissioned: ${serviceName} by ${authedUser.id}:${authedUser.displayName}`,
        data: {
          serviceName
        },
        user: authedUser
      })

      request.logger.info(`Service ${serviceName} decommissioned`)
      return h.redirect(`/admin/decommission-service/${serviceName}/summary`)
    } catch (error) {
      request.logger.error(`Service ${serviceName} decommissioning failed`)

      request.yar.flash(sessionNames.validationFailure)
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/decommission-service/${serviceName}/step-2`)
    }
  }
}
