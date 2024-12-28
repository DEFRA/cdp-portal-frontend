import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTeam } from '~/src/server/teams/helpers/fetch/fetch-team.js'
import { transformTeamToSummary } from '~/src/server/teams/transformers/team-to-summary.js'
import { transformTeamUsersToTaskList } from '~/src/server/teams/transformers/team-users-to-task-list.js'
import { servicesToDetailedList } from '~/src/server/teams/transformers/services-to-detailed-list.js'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'
import { testSuitesToDetailedList } from '~/src/server/teams/transformers/test-suites-to-detailed-list.js'
import { librariesToDetailedList } from '~/src/server/teams/transformers/libraries-to-detailed-list.js'
import { templatesToDetailedList } from '~/src/server/teams/transformers/templates-to-detailed-list.js'
import {
  fetchTeamServices,
  fetchTeamTestSuites,
  fetchTeamRepositories
} from '~/src/server/teams/helpers/fetch/fetchers.js'

const teamController = {
  options: {
    id: 'teams/{teamId}',
    validate: {
      params: Joi.object({
        teamId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { team } = await fetchTeam(request.params.teamId)
    const teamsServices = /** @type {Array} */ await fetchTeamServices(
      team.teamId
    )
    const teamTestSuites = /** @type {Array} */ await fetchTeamTestSuites(
      team.teamId
    )

    const userIsTeamMember = await request.userIsMemberOfATeam([team.teamId])
    const hasGitHub = Boolean(team?.github)

    const {
      services: gitHubServiceRepositories,
      libraries: gitHubLibraryRepositories,
      templates: gitHubTemplateRepositories,
      tests: gitHubTestSuiteRepositories
    } = hasGitHub ? await fetchTeamRepositories(team.teamId) : {}

    return h.view('teams/views/team', {
      pageTitle: `${team.name} Team`,
      summaryList: transformTeamToSummary(team, userIsTeamMember),
      usersTaskList: transformTeamUsersToTaskList(team, userIsTeamMember),
      services: servicesToDetailedList(
        teamsServices.map(repositoriesDecorator(gitHubServiceRepositories))
      ),
      testSuites: testSuitesToDetailedList(
        teamTestSuites.map(({ testSuite }) =>
          repositoriesDecorator(gitHubTestSuiteRepositories)(testSuite)
        )
      ),
      libraries: librariesToDetailedList(gitHubLibraryRepositories),
      templates: templatesToDetailedList(gitHubTemplateRepositories),
      team,
      userIsTeamMember,
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
