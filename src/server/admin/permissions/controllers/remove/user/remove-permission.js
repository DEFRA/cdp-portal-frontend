import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { removeScopeFromUser } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { userIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

const removePermissionFromUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation,
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    },
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const params = request.params
    const userId = params.userId
    const scopeId = params.scopeId

    try {
      await removeScopeFromUser(request, userId, scopeId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Permission removed from user',
        type: 'success'
      })

      request.audit.sendMessage({
        event: `permission: ${scopeId} removed from user: ${userId} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
        data: {
          userId,
          scopeId
        },
        user: request.pre.authedUser
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/admin/permissions/' + scopeId)
  }
}

export { removePermissionFromUserController }
