import Joi from 'joi'
import Boom from '@hapi/boom'
import {
  scopes,
  teamIdValidation,
  userIdValidation
} from '@defra/cdp-validation-kit'

import { fetchCdpTeam } from '../../../admin/teams/helpers/fetch/fetchers.js'
import { fetchCdpUser } from '../../../admin/users/helpers/fetch/fetchers.js'

const confirmRemoveBreakGlassController = {
  options: {
    id: 'teams/{teamId}/remove-break-glass/{userId}',
    auth: {
      mode: 'required',
      access: {
        scope: [
          scopes.canGrantBreakGlass,
          `${scopes.canGrantBreakGlass}:team:{params.teamId}`
        ]
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
    const pageTitle = 'Remove break glass'

    const userSession = await request.getUserSession()
    const team = await fetchCdpTeam(request.params.teamId)
    const user = await fetchCdpUser(request.params.userId)

    return h.view('teams/views/remove/confirm-remove-break-glass', {
      pageTitle,
      team,
      user,
      grantingUser: {
        id: userSession.id,
        displayName: userSession.displayName,
        email: userSession.email
      },
      breadcrumbs: [
        {
          text: 'Teams',
          href: '/teams'
        },
        {
          text: team.name,
          href: '/teams/' + team.teamId
        },
        {
          text: pageTitle
        }
      ]
    })
  }
}

export { confirmRemoveBreakGlassController }
