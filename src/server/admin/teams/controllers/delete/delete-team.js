import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'

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
      config.get('userServiceApiUrl') + `/teams/${teamId}`

    try {
      const { response } = await request.authedFetcher(deleteTeamEndpointUrl, {
        method: 'delete'
      })

      if (response.ok) {
        request.yar.flash(sessionNames.notifications, {
          text: 'Team deleted and removed from all users',
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
