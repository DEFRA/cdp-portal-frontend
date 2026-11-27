import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '#server/common/helpers/options/build-options.js'
import {
  searchAzureActiveDirectoryUsers,
  searchGithubUsers
} from '../../helpers/fetch/fetchers.js'
import { searchCdpUsers } from '#server/admin/teams/helpers/fetch/fetchers.js'

export const addUserFormController = {
  options: {
    validate: {
      query: Joi.object({
        aadQuery: Joi.string().allow(''),
        email: Joi.string().allow(''),
        githubQuery: Joi.string().allow(''),
        github: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const {
      aadQuery = '',
      email = '',
      githubQuery = '',
      github = ''
    } = request.query

    request.logger.info(
      {
        query: request.query,
        requestedWith: request.headers['x-requested-with'],
        referer: request.headers.referer,
        accept: request.headers.accept
      },
      'Add user GET request'
    )

    const { usersToCreate = [] } = request.app.getStepData()

    const [aadUsers, githubUsers, cdpUsers] = await Promise.all([
      aadQuery ? searchAzureActiveDirectoryUsers(aadQuery) : [],
      githubQuery ? searchGithubUsers(githubQuery) : [],
      aadQuery ? searchCdpUsers() : []
    ])

    // Exclude existing CDP users and users already added to the pending list
    const existingUserIds = new Set(usersToCreate.map((user) => user.userId))

    const existingEmails = new Set(
      [
        ...cdpUsers.map((user) => user.email),
        ...usersToCreate.map((user) => user.email)
      ]
        .filter(Boolean)
        .map((email) => email.toLowerCase())
    )

    const newAadUsers = aadUsers.filter((user) => {
      const userEmail = user.email?.toLowerCase()

      return !existingUserIds.has(user.userId) && !existingEmails.has(userEmail)
    })

    // Exclude GitHub accounts already assigned to pending users
    const existingGithubUsers = new Set(
      usersToCreate.map((user) => user.github?.toLowerCase()).filter(Boolean)
    )

    const newGithubUsers = githubUsers.filter(
      (user) => !existingGithubUsers.has(user.github?.toLowerCase())
    )

    return h.view('admin/users/views/save/add-user-form', {
      pageTitle: 'Add a user',
      formButtonText: 'Add user',
      formValues: {
        aadQuery,
        email,
        githubQuery,
        github
      },
      aadUsers: newAadUsers.length
        ? buildOptions(
            newAadUsers.map((aadUser) => ({
              text: `${aadUser.name} - ${aadUser.email}`,
              value: aadUser.email
            })),
            false
          )
        : null,
      githubUsers: newGithubUsers.length
        ? buildOptions(
            newGithubUsers.map((githubUser) => ({
              text: `@${githubUser.github} ${
                githubUser.name ? `- ${githubUser.name}` : ''
              }`,
              value: githubUser.github
            })),
            false
          )
        : null,
      splitPaneBreadcrumbs: [
        { text: 'Admin', href: '/admin' },
        { text: 'Users', href: '/admin/users' },
        { text: 'Add user' }
      ]
    })
  }
}
