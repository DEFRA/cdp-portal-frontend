import Joi from 'joi'
import Boom from '@hapi/boom'
import { scopes, teamIdValidation } from '@defra/cdp-validation-kit'

import { fetchTeam } from '../helpers/fetch/fetch-team.js'
import { transformTeamToSummary } from '../transformers/team-to-summary.js'
import { entitiesToDetailedList } from '../transformers/entities-to-detailed-list.js'
import { librariesToDetailedList } from '../transformers/libraries-to-detailed-list.js'
import { templatesToDetailedList } from '../transformers/templates-to-detailed-list.js'
import { fetchTeamRepositories } from '../helpers/fetch/fetchers.js'
import { fetchEntities } from '../../common/helpers/fetch/fetch-entities.js'
import { transformTeamUsersToRows } from '../transformers/team-users-to-rows.js'

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
      fetchTeam(teamId),
      fetchEntities({ type: 'Microservice', teamIds: teamId }),
      fetchEntities({ type: 'TestSuite', teamIds: teamId })
    ])

    const hasGitHub = Boolean(team?.github)

    const { libraries, templates } = hasGitHub
      ? await fetchTeamRepositories(teamId)
      : {}

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
      libraries: librariesToDetailedList(libraries),
      templates: templatesToDetailedList(templates),
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
