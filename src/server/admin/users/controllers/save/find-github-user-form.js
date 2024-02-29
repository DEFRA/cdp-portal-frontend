import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/ext/no-session-redirect'
import { resetGithubUserNameAnswer } from '~/src/server/admin/users/helpers/ext/reset-github-user-name-answer'
import { provideCdpUser } from '~/src/server/admin/users/helpers/pre/provide-cdp-user'
import { searchGithubUsers } from '~/src/server/admin/users/helpers/fetch'

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
    const heading = isEdit
      ? 'Edit Defra Github User.'
      : 'Find Defra Github User.'

    return h.view('admin/users/views/save/github-user-form', {
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
