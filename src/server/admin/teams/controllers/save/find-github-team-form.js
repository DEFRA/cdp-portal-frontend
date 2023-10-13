import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/build-options'
import { resetGithubAnswer } from '~/src/server/admin/teams/helpers/extensions/reset-github-answer'
import { searchGithubTeams } from '~/src/server/admin/teams/helpers/search-github-teams'
import { noSessionRedirect } from '~/src/server/admin/teams/helpers/prerequisites/no-session-redirect'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/prerequisites/provide-cdp-team'

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
    const heading = 'Find Defra Github Team'
    const updateOrCreate = isEdit ? 'Edit' : 'Create'

    return h.view('admin/teams/views/github-team-form', {
      pageTitle: heading,
      heading,
      headingCaption: 'Link the Defra Github team to the CDP team',
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
          text: updateOrCreate + ' team'
        }
      ]
    })
  }
}

export { findGithubTeamFormController }
