import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { transformTeamToSummary } from '~/src/server/admin/teams/transformers/team-to-summary.js'
import { transformTeamUsersToTaskList } from '~/src/server/admin/teams/transformers/team-users-to-task-list.js'
import { transformTeamScopesToTaskList } from '~/src/server/admin/teams/transformers/team-scopes-to-task-list.js'

const teamController = {
  options: {
    id: 'admin/teams/{teamId}',
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
      pageTitle: `${team.name} Team`,
      team,
      summaryList: transformTeamToSummary(team),
      usersTaskList: transformTeamUsersToTaskList(team),
      scopesTaskList: transformTeamScopesToTaskList(team),
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
