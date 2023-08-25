import Joi from 'joi'
import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { fetchAdminTeam } from '~/src/server/admin/teams/helpers/fetch-admin-team'
import { transformTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-team-to-entity-data-list'
import { transformTeamToHeadingEntities } from '~/src/server/admin/teams/transformers/transform-team-to-heading-entities'

const teamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { team } = await fetchAdminTeam(request.params.teamId)

    return h.view('admin/teams/views/team', {
      pageTitle: startCase(team.name),
      heading: startCase(team.name),
      entityDataList: transformTeamToEntityDataList(team),
      headingEntities: transformTeamToHeadingEntities(team),
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
