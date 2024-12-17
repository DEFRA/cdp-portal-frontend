import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch/index.js'

const confirmRemoveMemberController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().guid().required(),
        userId: Joi.string().guid().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { team } = await fetchCdpTeam(request.params.teamId)
    const { user } = await fetchCdpUser(request.params.userId)
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
