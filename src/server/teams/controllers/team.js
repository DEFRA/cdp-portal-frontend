import Joi from 'joi'
import Boom from '@hapi/boom'
import { scopes, teamIdValidation } from '@defra/cdp-validation-kit'

import { transformTeamToSummary } from '../transformers/team-to-summary.js'
import { entitiesToDetailedList } from '../transformers/entities-to-detailed-list.js'
import {
  fetchServices,
  fetchTestSuites
} from '../../common/helpers/fetch/fetch-entities.js'
import { transformTeamUsersToRows } from '../transformers/team-users-to-rows.js'
import { fetchCdpTeam } from '../../admin/teams/helpers/fetch/fetchers.js'

const teamController = {
  options: {
    id: 'teams/{teamId}',
    validate: {
      params: Joi.object({
        teamId: teamIdValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const teamId = request.params.teamId
    const userIsServiceOwner = await request.userIsServiceOwner([teamId])
    const userIsAdmin = await request.userIsAdmin()
    const isServiceOwnerOrAdmin = userIsServiceOwner || userIsAdmin

    const hasTeamBasedCanGrantBreakGlass = request.hasScope(
      `${scopes.canGrantBreakGlass}:team:${teamId}`
    )
    const hasUserBasedCanGrantBreakGlass = request.hasScope(
      scopes.canGrantBreakGlass
    )
    const hasCanGrantBreakGlass =
      hasTeamBasedCanGrantBreakGlass || hasUserBasedCanGrantBreakGlass

    const [team, teamsServices, teamTestSuites] = await Promise.all([
      fetchCdpTeam(teamId),
      fetchServices({
        teamIds: teamId
      }),
      fetchTestSuites({
        teamIds: teamId
      })
    ])

    return h.view('teams/views/team', {
      pageTitle: `${team.name} Team`,
      summaryList: transformTeamToSummary({
        team,
        withActions: isServiceOwnerOrAdmin
      }),
      teamUsersRows: transformTeamUsersToRows({
        team,
        withActions: isServiceOwnerOrAdmin,
        hasCanGrantBreakGlass
      }),
      services: entitiesToDetailedList('services', teamsServices),
      testSuites: entitiesToDetailedList('test-suites', teamTestSuites),
      team,
      userIsServiceOwner,
      isServiceOwnerOrAdmin,
      breadcrumbs: [
        {
          text: 'Teams',
          href: '/teams'
        },
        {
          text: team.name
        }
      ]
    })
  }
}

export { teamController }
