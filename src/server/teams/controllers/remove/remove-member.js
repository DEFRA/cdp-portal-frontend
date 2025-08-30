import Joi from 'joi'
import Boom from '@hapi/boom'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import {
  teamIdValidation,
  userIdValidation
} from '@defra/cdp-validation-kit/src/validations.js'

import { sessionNames } from '../../../common/constants/session-names.js'
import { removeMemberFromTeam } from '../../../admin/teams/helpers/fetch/index.js'

const removeMemberController = {
  options: {
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, 'team:{params.teamId}']
      }
    },
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

    const { error } = await removeMemberFromTeam(request, teamId, userId)

    if (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    if (!error) {
      request.yar.flash(sessionNames.notifications, {
        text: 'Member removed from team',
        type: 'success'
      })
    }

    return h.redirect('/teams/' + teamId)
  }
}

export { removeMemberController }
