import Joi from 'joi'
import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { creations } from '~/src/server/create/constants/creations'
import { buildOptions } from '~/src/server/common/helpers/build-options'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'

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

    const creationItems = Object.values(creations).map((creation) => ({
      text: startCase(creation),
      value: creation
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
