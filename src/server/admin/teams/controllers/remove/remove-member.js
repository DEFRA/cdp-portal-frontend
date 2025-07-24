import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { removeMemberFromTeam } from '../../helpers/fetch/index.js'
import {
  teamIdValidation,
  userIdValidation
} from '@defra/cdp-validation-kit/src/validations.js'

const removeMemberController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation,
        userId: userIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const teamId = params.teamId
    const userId = params.userId

    try {
      await removeMemberFromTeam(request, teamId, userId)

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
