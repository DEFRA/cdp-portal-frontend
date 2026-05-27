import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { searchGithubTeams } from '../../helpers/fetch/fetchers.js'

const findGithubTeamFormController = {
  options: {
    validate: {
      query: Joi.object({
        githubSearch: Joi.string().allow(''),
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

    const searchGithubTeamsResponse = githubSearch
      ? await searchGithubTeams(githubSearch)
      : null
    const githubTeams = searchGithubTeamsResponse ?? []

    const isEdit = cdpTeam?.isEdit
    const heading = 'Find Defra GitHub Team'
    const updateOrCreate = isEdit ? 'Edit' : 'Create'

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
        false
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
          text: updateOrCreate
        }
      ]
    })
  }
}

export { findGithubTeamFormController }
