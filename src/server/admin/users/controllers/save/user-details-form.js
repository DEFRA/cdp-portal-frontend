import Joi from 'joi'
import Boom from '@hapi/boom'

import { noSessionRedirect } from '~/src/server/admin/users/helpers/ext/no-session-redirect'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'

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
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser
    const isEdit = cdpUser.isEdit ?? false

    const heading = isEdit ? 'Edit CDP user details' : 'Add CDP user details'
    const redirectLocation = request.query?.redirectLocation

    return h.view('admin/users/views/save/user-details-form', {
      pageTitle: heading,
      heading,
      headingCaption: 'Add Core Delivery Platform (CDP) user details',
      formButtonText: redirectLocation ? 'Save' : 'Next',
      usersAadName: cdpUser?.aadName,
      redirectLocation,
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

export { userDetailsFormController }
