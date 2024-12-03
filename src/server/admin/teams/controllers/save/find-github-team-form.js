import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { resetGithubAnswer } from '~/src/server/admin/teams/helpers/ext/reset-github-answer.js'
import { searchGithubTeams } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { noSessionRedirect } from '~/src/server/admin/teams/helpers/ext/no-session-redirect.js'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team.js'

const findGithubTeamFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect, resetGithubAnswer]
    },
    pre: [provideCdpTeam],
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
    const cdpTeam = request.pre?.cdpTeam

    const query = request?.query
    const githubSearch = query?.githubSearch ?? cdpTeam?.github
    const github = query?.github
    const redirectLocation = query?.redirectLocation

    const searchGithubTeamsResponse = githubSearch
      ? await searchGithubTeams(githubSearch)
      : null
    const githubTeams = searchGithubTeamsResponse?.teams ?? []

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
      breadcrumbs: [
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
