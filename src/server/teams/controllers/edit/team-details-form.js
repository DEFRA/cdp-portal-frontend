import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpTeam } from '../../../admin/teams/helpers/fetch/index.js'

const teamDetailsFormController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { team } = await fetchCdpTeam(request.params.teamId)
    const heading = 'Edit Team'

    return h.view('teams/views/edit/team-details-form', {
      pageTitle: heading,
      team,
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
          text: 'Edit'
        }
      ]
    })
  }
}

export { teamDetailsFormController }
