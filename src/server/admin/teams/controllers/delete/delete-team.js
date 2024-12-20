import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'

const deleteTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const teamId = request.params.teamId
    const deleteTeamEndpointUrl =
      config.get('userServiceBackendUrl') + `/teams/${teamId}`

    try {
      const { response } = await request.authedFetcher(deleteTeamEndpointUrl, {
        method: 'delete'
      })

      if (response.ok) {
        request.yar.flash(sessionNames.notifications, {
          text: 'All users removed from team and team deleted',
          type: 'success'
        })

        return h.redirect('/admin/teams')
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/teams/${teamId}/confirm-delete`)
    }
  }
}

export { deleteTeamController }
