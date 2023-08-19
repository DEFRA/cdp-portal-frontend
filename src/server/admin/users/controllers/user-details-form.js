import Joi from 'joi'
import Boom from '@hapi/boom'

import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'

const userDetailsFormController = {
  options: {
    pre: [noSessionRedirect],
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const redirectLocation = request.query?.redirectLocation

    return h.view('admin/users/views/user-details-form', {
      pageTitle: 'Add CDP user details',
      heading: 'Add CDP user details',
      headingCaption: 'Add Core Delivery Platform (CDP) user details',
      formButtonText: redirectLocation ? 'Save' : 'Next',
      redirectLocation
    })
  }
}

export { userDetailsFormController }
