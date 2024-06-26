import Joi from 'joi'
import Boom from '@hapi/boom'

import { noSessionRedirect } from '~/src/server/admin/users/helpers/ext/no-session-redirect'
import { provideCdpUser } from '~/src/server/admin/users/helpers/pre/provide-cdp-user'

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

    const heading = isEdit ? 'Edit CDP user details' : 'Add CDP user details'
    const redirectLocation = request.query?.redirectLocation

    return h.view('admin/users/views/save/user-details-form', {
      pageTitle: heading,
      heading,
      headingCaption: 'Add Core Delivery Platform user details.',
      formButtonText: redirectLocation ? 'Save' : 'Next',
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
