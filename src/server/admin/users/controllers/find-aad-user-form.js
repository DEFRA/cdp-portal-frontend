import Joi from 'joi'
import Boom from '@hapi/boom'

import { searchAadUsers } from '~/src/server/admin/users/helpers/search-add-users'
import { buildOptions } from '~/src/common/helpers/build-options'
import { resetAadAnswer } from '~/src/server/admin/users/helpers/extensions/reset-aad-answer'

const findAadUserFormController = {
  options: {
    ext: {
      onPreHandler: resetAadAnswer
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

    const aadUsers = aadQuery ? await searchAadUsers(aadQuery) : []

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
