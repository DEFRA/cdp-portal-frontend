import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTeam } from '~/src/server/teams/helpers/fetch/fetch-team.js'
import { transformTeamToSummary } from '~/src/server/teams/transformers/team-to-summary.js'
import { entitiesToDetailedList } from '~/src/server/teams/transformers/entities-to-detailed-list.js'
import { librariesToDetailedList } from '~/src/server/teams/transformers/libraries-to-detailed-list.js'
import { templatesToDetailedList } from '~/src/server/teams/transformers/templates-to-detailed-list.js'
import { fetchTeamRepositories } from '~/src/server/teams/helpers/fetch/fetchers.js'
import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'

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
    const teamId = request.params.teamId
    const userIsServiceOwner = await request.userIsServiceOwner([teamId])
    const userIsAdmin = await request.userIsAdmin()

    const [{ team }, teamsServices, teamTestSuites] = await Promise.all([
      fetchTeam(teamId),
      fetchEntities({ type: 'Microservice', teamId }),
      fetchEntities({ type: 'TestSuite', teamId })
    ])

    const hasGitHub = Boolean(team?.github)

    const { libraries, templates } = hasGitHub
      ? await fetchTeamRepositories(teamId)
      : {}

    return h.view('teams/views/team', {
      pageTitle: `${team.name} Team`,
      summaryList: transformTeamToSummary(
        team,
        userIsServiceOwner || userIsAdmin
      ),
      services: entitiesToDetailedList('services', teamsServices),
      testSuites: entitiesToDetailedList('test-suites', teamTestSuites),
      libraries: librariesToDetailedList(libraries),
      templates: templatesToDetailedList(templates),
      team,
      userIsServiceOwner,
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
