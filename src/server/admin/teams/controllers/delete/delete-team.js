import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { teamIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

const deleteTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const teamId = request.params.teamId
    const deleteTeamEndpointUrl =
      config.get('userServiceBackendUrl') + `/teams/${teamId}`

    try {
      await request.authedFetchJson(deleteTeamEndpointUrl, {
        method: 'delete'
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'All users removed from team and team deleted',
        type: 'success'
      })

      return h.redirect('/admin/teams')
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/teams/${teamId}/confirm-delete`)
    }
  }
}

export { deleteTeamController }
