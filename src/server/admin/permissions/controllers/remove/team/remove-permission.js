import Boom from '@hapi/boom'
import { teamIdValidation } from '@defra/cdp-validation-kit'

import Joi from 'joi'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import { removeScopeFromTeam } from '../../../helpers/fetchers.js'

const removePermissionFromTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation,
        scopeId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
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
        event: `permission: ${scopeId} removed from team: ${teamId}`,
        data: { teamId, scopeId }
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/admin/permissions/' + scopeId)
  }
}

export { removePermissionFromTeamController }
