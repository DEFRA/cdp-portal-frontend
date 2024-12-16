import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTeam } from '~/src/server/teams/helpers/fetch/fetch-team.js'
import { transformTeamToSummary } from '~/src/server/teams/transformers/team-to-summary.js'
import { transformTeamUsersToTaskList } from '~/src/server/teams/transformers/team-users-to-task-list.js'
import { teamServicesToDetailedList } from '~/src/server/teams/transformers/team-services-to-detailed-list.js'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'
import { teamTestSuitesToDetailedList } from '~/src/server/teams/transformers/team-test-suites-to-detailed-list.js'
import { transformToTaskList } from '~/src/server/teams/transformers/to-task-list.js'
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
    const services = /** @type {Array} */ await fetchTeamServices(team.teamId)
    const testSuites = /** @type {Array} */ await fetchTeamTestSuites(
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

    const testSuiteDecorator = repositoriesDecorator(
      gitHubTestSuiteRepositories
    )

    return h.view('teams/views/team', {
      pageTitle: `${team.name} Team`,
      summaryList: transformTeamToSummary(team, userIsTeamMember),
      usersTaskList: transformTeamUsersToTaskList(team, userIsTeamMember),
      teamServices: teamServicesToDetailedList(
        services.map(repositoriesDecorator(gitHubServiceRepositories))
      ),
      teamTestSuites: teamTestSuitesToDetailedList(
        testSuites.map(({ testSuite }) => testSuiteDecorator(testSuite))
      ),
      servicesTaskList: transformToTaskList(gitHubServiceRepositories),
      librariesTaskList: transformToTaskList(gitHubLibraryRepositories),
      templatesTaskList: transformToTaskList(gitHubTemplateRepositories),
      testsTaskList: transformToTaskList(gitHubTestSuiteRepositories),
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
