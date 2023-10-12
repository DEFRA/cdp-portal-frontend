import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { removeMemberFromTeam } from '~/src/server/admin/teams/helpers/remove-member-from-team'

const removeMemberController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().guid().required(),
        userId: Joi.string().guid().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const teamId = params.teamId
    const userId = params.userId

    try {
      await removeMemberFromTeam(request.fetchWithAuth, teamId, userId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Member removed from team',
        type: 'success'
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect(config.get('appPathPrefix') + '/admin/teams/' + teamId)
  }
}

export { removeMemberController }
