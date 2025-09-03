import Boom from '@hapi/boom'
import { teamIdValidation, userIdValidation } from '@defra/cdp-validation-kit'

import Joi from '../../../../../common/helpers/extended-joi.js'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import { removeScopeFromMember } from '../../../helpers/fetchers.js'

const removePermissionFromMemberController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation,
        scopeId: Joi.objectId().required(),
        teamId: teamIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userSession = await request.getUserSession()
    const params = request.params
    const userId = params.userId
    const scopeId = params.scopeId
    const teamId = params.teamId

    try {
      await removeScopeFromMember({
        request,
        userId,
        scopeId,
        teamId
      })

      request.audit.sendMessage({
        event: `permission: ${scopeId} removed from member: ${userId} in team: ${teamId} by ${userSession.id}:${userSession.email}`,
        data: { userId, scopeId },
        user: userSession
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'Permission removed from member',
        type: 'success'
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/admin/permissions/' + scopeId)
  }
}

export { removePermissionFromMemberController }
