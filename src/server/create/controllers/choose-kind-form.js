import Joi from 'joi'
import Boom from '@hapi/boom'

import { getCreations } from '~/src/server/create/constants/creations.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'
import { isFeatureToggleActiveForPath } from '~/src/server/admin/features/helpers/fetch-feature-toggles.js'

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
  handler: async (request, h) => {
    const query = request?.query

    const prototypesDisabled =
      await isFeatureToggleActiveForPath('/create/prototype')

    const createItems = Object.values(getCreations(prototypesDisabled)).map(
      (creation) => ({
        value: creation.kind,
        text: creation.title,
        hint: {
          text: creation.hint
        },
        label: { classes: 'govuk-!-font-weight-bold' }
      })
    )

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
