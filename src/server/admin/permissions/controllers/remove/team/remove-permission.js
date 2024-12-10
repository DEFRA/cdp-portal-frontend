import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { removeScopeFromTeam } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'

const removePermissionFromTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().guid().required(),
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    },
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const params = request.params
    const teamId = params.teamId
    const scopeId = params.scopeId

    try {
      await removeScopeFromTeam(request, teamId, scopeId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Permission removed from team',
        type: 'success'
      })

      request.audit.sendMessage({
        event: `permission: ${scopeId} removed from team: ${teamId} by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
        data: {
          teamId,
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

export { removePermissionFromTeamController }