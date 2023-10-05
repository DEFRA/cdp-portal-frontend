import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/build-options'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { resetGithubUserNameAnswer } from '~/src/server/admin/users/helpers/extensions/reset-github-user-name-answer'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { searchGithubUsers } from '~/src/server/admin/users/helpers/search-github-users'

const findGithubUserFormController = {
  options: {
    ext: {
      onPreHandler: resetGithubUserNameAnswer
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
    const cdpUser = request.pre?.cdpUser

    const query = request?.query
    const githubSearch = query?.githubSearch ?? cdpUser?.github
    const github = query?.github
    const redirectLocation = query?.redirectLocation

    const searchGithubUsersResponse = githubSearch
      ? await searchGithubUsers(githubSearch)
      : null
    const githubUsers = searchGithubUsersResponse?.users ?? []

    const isEdit = cdpUser.isEdit ?? false
    const heading = isEdit ? 'Edit Defra Github User' : 'Find Defra Github User'

    return h.view('admin/users/views/github-user-form', {
      pageTitle: heading,
      heading,
      headingCaption: 'Search for the Defra Github user',
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      formValues: { githubSearch, github },
      githubUsers: buildOptions(
        githubUsers.map((githubUser) => ({
          text: `@${githubUser.github} ${
            githubUser.name ? `- ${githubUser.name}` : ''
          }`,
          value: githubUser.github
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

export { findGithubUserFormController }
