import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpTeam } from '../helpers/fetch/fetchers.js'
import { transformTeamToSummary } from '../transformers/team-to-summary.js'
import { transformTeamUsersToTaskList } from '../transformers/team-users-to-task-list.js'
import { transformTeamScopesToTaskList } from '../transformers/team-scopes-to-task-list.js'

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
    const team = await fetchCdpTeam(request.params.teamId)

    return h.view('admin/teams/views/team', {
      pageTitle: `${team.name} Team`,
      team,
      summaryList: transformTeamToSummary(team),
      usersTaskList: transformTeamUsersToTaskList(team),
      scopesTaskList: transformTeamScopesToTaskList(team),
      splitPaneBreadcrumbs: [
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
