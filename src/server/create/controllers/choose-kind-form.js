import Joi from 'joi'
import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { creations } from '~/src/server/create/constants/creations.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
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
    const creationItems = Object.entries(creations).map(([key, value]) => ({
      text: startCase(value),
      value: key
    }))

    return h.view('create/views/choose-kind-form', {
      pageTitle: 'Create',
      heading: 'Create',
      createItems: buildOptions(creationItems, false),
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation
    })
  }
}

export { chooseKindFormController }
