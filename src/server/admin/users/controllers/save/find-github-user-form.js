import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/ext/no-session-redirect.js'
import { resetGithubUserNameAnswer } from '~/src/server/admin/users/helpers/ext/reset-github-user-name-answer.js'
import { provideCdpUser } from '~/src/server/admin/users/helpers/pre/provide-cdp-user.js'
import { searchGithubUsers } from '~/src/server/admin/users/helpers/fetch/index.js'

const findGithubUserFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect, resetGithubUserNameAnswer]
    },
    pre: [provideCdpUser],
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
    const pageTitle = isEdit
      ? 'Edit Defra GitHub User'
      : 'Find Defra GitHub User'

    return h.view('admin/users/views/save/github-user-form', {
      pageTitle,
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
          text: isEdit ? 'Edit' : 'Create'
        }
      ]
    })
  }
}

export { findGithubUserFormController }
