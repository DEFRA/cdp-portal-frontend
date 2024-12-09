import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { removeScopeFromUser } from '~/src/server/admin/permissions/helpers/fetchers.js'

const removePermissionFromUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: Joi.string().guid().required(),
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
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
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/admin/permissions/' + scopeId)
  }
}

export { removePermissionFromUserController }
