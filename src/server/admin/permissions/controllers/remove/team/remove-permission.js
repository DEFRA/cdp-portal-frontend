import Boom from '@hapi/boom'

import Joi from '../../../../../common/helpers/extended-joi.js'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import { removeScopeFromTeam } from '../../../helpers/fetchers.js'
import { provideAuthedUser } from '../../../../../common/helpers/auth/pre/provide-authed-user.js'
import { teamIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

const removePermissionFromTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation,
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
