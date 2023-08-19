import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchAadUsers } from '~/src/server/admin/users/helpers/fetch-add-users'
import { buildOptions } from '~/src/common/helpers/build-options'
import { resetAadAnswer } from '~/src/server/admin/users/helpers/extensions/reset-aad-answer'

const findAadUserFormController = {
  options: {
    ext: {
      onPreHandler: resetAadAnswer
    },
    validate: {
      query: Joi.object({
        emailSearch: Joi.string().allow(''),
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const query = request?.query
    const emailSearch = query?.emailSearch || null
    const redirectLocation = query?.redirectLocation

    const aadUsers = emailSearch ? await fetchAadUsers(emailSearch) : []

    return h.view('admin/users/views/aad-user-form', {
      pageTitle: 'Find AAD User',
      heading: 'Find AAD User',
      headingCaption: 'Search for the Defra Azure Active Directory (AAD) user',
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      formValues: { emailSearch },
      aadUsers: buildOptions(
        aadUsers.map((aadUser) => aadUser.mail),
        false
      )
    })
  }
}

export { findAadUserFormController }
