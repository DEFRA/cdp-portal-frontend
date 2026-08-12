import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '#server/common/helpers/options/build-options.js'
import fetchAllGithubTeams from '../../helpers/fetch/fetchers.js'

const findGithubTeamFormController = {
  options: {
    validate: {
      query: Joi.object({
        github: Joi.string().allow(''),
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const cdpTeam = request.app.getStepData()

    const query = request?.query
    const githubSearch = query?.githubSearch ?? cdpTeam?.github
    const github = query?.github
    const redirectLocation = query?.redirectLocation

    const searchGithubTeamsResponse = await fetchAllGithubTeams()
    const githubTeams = searchGithubTeamsResponse ?? []

    const heading = 'Find Defra GitHub Team'

    return h.view('admin/teams/views/save/github-team-form', {
      pageTitle: heading,
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      formValues: { githubSearch, github },
      githubTeams: buildOptions(
        githubTeams.map((githubTeam) => ({
          text: `${githubTeam.name} - @${githubTeam.github}`,
          value: githubTeam.github
        })),
        true
      ),
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
          text: 'Create'
        }
      ]
    })
  }
}

export { findGithubTeamFormController }
