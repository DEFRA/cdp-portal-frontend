import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '../../../../common/helpers/options/build-options.js'
import { resetAadAnswer } from '../../helpers/ext/reset-aad-answer.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { searchAzureActiveDirectoryUsers } from '../../helpers/fetch/fetchers.js'
import { provideCdpUser } from '../../helpers/pre/provide-cdp-user.js'

const findAadUserFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect, resetAadAnswer]
    },
    pre: [provideCdpUser],
    validate: {
      query: Joi.object({
        aadQuery: Joi.string().allow(''),
        email: Joi.string().allow(''),
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser

    const query = request?.query
    const email = query?.email || null
    const aadQuery = query?.aadQuery ?? cdpUser.email ?? null
    const redirectLocation = query?.redirectLocation

    const searchAadUsersResponse = aadQuery
      ? await searchAzureActiveDirectoryUsers(aadQuery)
      : null
    const aadUsers = searchAadUsersResponse ?? []

    return h.view('admin/users/views/save/aad-user-form', {
      pageTitle: 'Find DEFRA user',
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      formValues: { aadQuery, email },
      aadUsers: aadUsers?.length
        ? buildOptions(
            aadUsers.map((aadUser) => ({
              text: `${aadUser.name} - ${aadUser.email}`,
              value: aadUser.email
            })),
            false
          )
        : null,
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
          text: 'Create'
        }
      ]
    })
  }
}

export { findAadUserFormController }
