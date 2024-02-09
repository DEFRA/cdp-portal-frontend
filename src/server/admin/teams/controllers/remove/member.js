import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { removeMemberFromTeam } from '~/src/server/admin/teams/helpers/fetch'

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
      await removeMemberFromTeam(request.authedFetcher, teamId, userId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Member removed from team',
        type: 'success'
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/admin/teams/' + teamId)
  }
}

export { removeMemberController }
