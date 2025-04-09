import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTeam } from '~/src/server/teams/helpers/fetch/fetch-team.js'
import { transformTeamToSummary } from '~/src/server/teams/transformers/team-to-summary.js'
import { servicesToDetailedList } from '~/src/server/teams/transformers/services-to-detailed-list.js'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'
import { testSuitesToDetailedList } from '~/src/server/teams/transformers/test-suites-to-detailed-list.js'
import { librariesToDetailedList } from '~/src/server/teams/transformers/libraries-to-detailed-list.js'
import { templatesToDetailedList } from '~/src/server/teams/transformers/templates-to-detailed-list.js'
import { fetchTestSuites } from '~/src/server/common/helpers/fetch/fetch-test-suites.js'
import {
  fetchTeamServices,
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
    // TODO parallelise these requests
    const { team } = await fetchTeam(request.params.teamId)
    const teamId = team.teamId
    const teamsServices = await fetchTeamServices(teamId)
    const teamTestSuites = await fetchTestSuites(teamId)

    const userIsTeamMember = await request.userIsMemberOfATeam([teamId])
    const authedUser = await request.getUserSession()
    const hasGitHub = Boolean(team?.github)

    const {
      services: gitHubServiceRepositories,
      libraries: gitHubLibraryRepositories,
      templates: gitHubTemplateRepositories,
      tests: gitHubTestSuiteRepositories
    } = hasGitHub ? await fetchTeamRepositories(teamId) : {}

    return h.view('teams/views/team', {
      pageTitle: `${team.name} Team`,
      summaryList: transformTeamToSummary(
        team,
        userIsTeamMember || authedUser?.isAdmin
      ),
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
