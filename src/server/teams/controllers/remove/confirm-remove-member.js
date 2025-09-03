import Joi from 'joi'
import Boom from '@hapi/boom'
import {
  teamIdValidation,
  userIdValidation,
  scopes
} from '@defra/cdp-validation-kit'
import { fetchCdpTeam } from '../../../admin/teams/helpers/fetch/index.js'
import { fetchCdpUser } from '../../../admin/users/helpers/fetch/index.js'

const confirmRemoveMemberController = {
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
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const team = await fetchCdpTeam(request.params.teamId)
    const user = await fetchCdpUser(request.params.userId)
    const title = 'Remove'

    return h.view('teams/views/remove/confirm-remove-member', {
      pageTitle: 'Remove Team Member',
      team,
      user,
      breadcrumbs: [
        {
          text: 'Teams',
          href: '/teams'
        },
        {
          text: team.name,
          href: `/teams/${team.teamId}`
        },
        {
          text: title
        }
      ]
    })
  }
}

export { confirmRemoveMemberController }
