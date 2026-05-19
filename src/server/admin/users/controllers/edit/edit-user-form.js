import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '#server/common/constants/session-names.js'
import {
  fetchCdpUser,
  searchGithubUsers
} from '../../helpers/fetch/fetchers.js'
import { userIdValidation } from '@defra/cdp-validation-kit'
import { buildOptions } from '#server/common/helpers/options/build-options.js'

const startEditUserController = {
  options: {
    id: 'admin/users/{userId}/edit',
    validate: {
      params: Joi.object({
        userId: userIdValidation
      }),
      query: Joi.object({
        githubSearch: Joi.string().allow(''),
        github: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    request.yar.clear(sessionNames.validationFailure)

    const user = await fetchCdpUser(request.params?.userId)

    const query = request?.query
    const githubSearch = query?.githubSearch ?? user?.github
    const github = query?.github

    const searchGithubUsersResponse = githubSearch
      ? await searchGithubUsers(githubSearch)
      : null
    const githubUsers = searchGithubUsersResponse ?? []

    return h.view('admin/users/views/edit/edit-user-form', {
      user,
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
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Users',
          href: '/admin/users'
        },
        {
          text: user.name,
          href: `/admin/users/${user.userId}`
        },
        {
          text: 'Edit'
        }
      ]
    })
  }
}

export { startEditUserController }
