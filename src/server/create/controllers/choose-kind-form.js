import Joi from 'joi'
import Boom from '@hapi/boom'

import { getCreations } from '../constants/creations.js'

const chooseKindFormController = {
  options: {
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const query = request?.query
    const userIsAdmin = await request.userIsAdmin()

    return h.view('create/views/choose-kind-form', {
      pageTitle: 'Create',
      heading: 'Create',
      headingCaption: 'What would you like to create?',
      createItems: getCreations(userIsAdmin),
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation
    })
  }
}

export { chooseKindFormController }
