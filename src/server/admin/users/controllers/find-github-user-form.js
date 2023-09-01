import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/build-options'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { resetGitHubAnswer } from '~/src/server/admin/users/helpers/extensions/reset-github-answer'
import { setStepComplete } from '~/src/server/admin/users/helpers/set-step-complete'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { searchGitHubUsers } from '~/src/server/admin/users/helpers/search-github-users'

const findGitHubUserFormController = {
  options: {
    ext: {
      onPreHandler: resetGitHubAnswer
    },
    pre: [noSessionRedirect, provideCdpUser],
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
    setStepComplete(request, 'stepOne')

    const cdpUser = request.pre?.cdpUser

    const query = request?.query
    const githubSearch = query?.githubSearch
    const github = query?.github
    const redirectLocation = query?.redirectLocation

    const searchGitHubUsersResponse = githubSearch
      ? await searchGitHubUsers(githubSearch)
      : null
    const gitHubUsers = searchGitHubUsersResponse?.users ?? []

    const isEdit = cdpUser.isEdit ?? false

    const heading = isEdit ? 'Edit Defra GitHub User' : 'Find Defra GitHub User'

    return h.view('admin/users/views/github-user-form', {
      pageTitle: heading,
      heading,
      headingCaption: 'Search for the Defra GitHub user',
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      formValues: { githubSearch, github },
      gitHubUsers: buildOptions(
        gitHubUsers.map((gitHubUser) => ({
          text: `@${gitHubUser.github} ${
            gitHubUser.name ? `- ${gitHubUser.name}` : ''
          }`,
          value: gitHubUser.github
        })),
        false
      ),
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Users',
          href: '/admin/users'
        },
        {
          text: `${isEdit ? 'Edit' : 'Create'} user`
        }
      ]
    })
  }
}

export { findGitHubUserFormController }
