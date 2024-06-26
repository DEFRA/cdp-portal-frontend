import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch'
import { transformCdpTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-data-list'
import { transformCdpTeamToHeadingEntities } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-heading-entities'
import { transformCdpTeamUsers } from '~/src/server/admin/teams/transformers/transform-cdp-team-users'

const teamController = {
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

    return h.view('admin/teams/views/team', {
      pageTitle: team.name,
      heading: team.name,
      entityDataList: transformCdpTeamToEntityDataList(team),
      headingEntities: transformCdpTeamToHeadingEntities(team),
      teamMembers: transformCdpTeamUsers(team),
      team,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Teams',
          href: '/admin/teams'
        },
        {
          text: team.name
        }
      ]
    })
  }
}

export { teamController }
