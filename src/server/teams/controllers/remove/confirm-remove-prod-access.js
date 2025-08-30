import Joi from 'joi'
import Boom from '@hapi/boom'
import { teamIdValidation, userIdValidation } from '@defra/cdp-validation-kit'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

import { fetchCdpTeam } from '../../../admin/teams/helpers/fetch/index.js'
import { fetchCdpUser } from '../../../admin/users/helpers/fetch/index.js'

const confirmRemoveProdAccessController = {
  options: {
    id: 'teams/{teamId}/remove-prod-access/{userId}',
    auth: {
      mode: 'required',
      access: {
        scope: [
          scopes.canGrantProdAccess,
          `${scopes.canGrantProdAccess}:team:{params.teamId}`
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
    const pageTitle = 'Remove prod access'

    const userSession = await request.getUserSession()
    const { team } = await fetchCdpTeam(request.params.teamId)
    const { user } = await fetchCdpUser(request.params.userId)

    return h.view('teams/views/remove/confirm-remove-prod-access', {
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

export { confirmRemoveProdAccessController }
