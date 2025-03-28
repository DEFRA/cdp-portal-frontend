import Joi from 'joi'
import Boom from '@hapi/boom'

import { creations } from '~/src/server/create/constants/creations.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'

const chooseKindFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: (request, h) => {
    const query = request?.query
    const createItems = Object.values(creations).map((creation) => ({
      value: creation.kind,
      text: creation.title,
      hint: {
        text: creation.hint
      },
      label: { classes: 'govuk-!-font-weight-bold' }
    }))

    return h.view('create/views/choose-kind-form', {
      pageTitle: 'Create',
      heading: 'Create',
      headingCaption: 'What would you like to create?',
      createItems,
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation
    })
  }
}

export { chooseKindFormController }
