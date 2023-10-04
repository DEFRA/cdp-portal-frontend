import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/build-options'
import { resetAadAnswer } from '~/src/server/admin/users/helpers/extensions/reset-aad-answer'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { searchAzureActiveDirectoryUsers } from '~/src/server/admin/users/helpers/search-azure-active-directory-users'

const findAadUserFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect, resetAadAnswer]
    },
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
    const query = request?.query
    const email = query?.email || null
    const aadQuery = query?.aadQuery || null
    const redirectLocation = query?.redirectLocation

    const searchAadUsersResponse = aadQuery
      ? await searchAzureActiveDirectoryUsers(aadQuery)
      : null
    const aadUsers = searchAadUsersResponse?.users ?? []

    return h.view('admin/users/views/aad-user-form', {
      pageTitle: 'Find AAD user',
      heading: 'Find AAD user',
      headingCaption: 'Search for the Defra Azure Active Directory (AAD) user',
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
          text: 'Create user'
        }
      ]
    })
  }
}

export { findAadUserFormController }