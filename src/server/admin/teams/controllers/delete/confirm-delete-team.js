import Joi from 'joi'
import Boom from '@hapi/boom'
import { teamIdValidation } from '@defra/cdp-validation-kit'

import { fetchCdpTeam } from '../../helpers/fetch/index.js'
import { transformTeamToSummary } from '../../transformers/team-to-summary.js'
import { transformTeamUsersToTaskList } from '../../transformers/team-users-to-task-list.js'

const confirmDeleteTeamController = {
  options: {
    id: 'admin/teams/{teamId}/confirm-delete',
    validate: {
      params: Joi.object({
        teamId: teamIdValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const team = await fetchCdpTeam(request.params?.teamId)

    return h.view('admin/teams/views/delete/confirm-delete-team', {
      pageTitle: 'Confirm Team Deletion',
      summaryList: transformTeamToSummary(team, false),
      usersTaskList: transformTeamUsersToTaskList(team, false),
      team,
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
          text: team.name,
          href: `/admin/teams/${team.teamId}`
        },
        {
          text: 'Delete'
        }
      ]
    })
  }
}

export { confirmDeleteTeamController }
