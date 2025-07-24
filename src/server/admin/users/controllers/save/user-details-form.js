import Joi from 'joi'
import Boom from '@hapi/boom'

import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { provideCdpUser } from '../../helpers/pre/provide-cdp-user.js'

const userDetailsFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpUser],
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: (request, h) => {
    const cdpUser = request.pre?.cdpUser
    const isEdit = cdpUser.isEdit ?? false

    const pageTitle = isEdit ? 'Edit User Details' : 'Add User Details'
    const redirectLocation = request.query?.redirectLocation

    return h.view('admin/users/views/save/user-details-form', {
      pageTitle,
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation,
      isEdit,
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

export { userDetailsFormController }
