import Joi from 'joi'
import Boom from '@hapi/boom'

import { FeatureToggleHelper } from '~/src/server/admin/features/helpers/feature-toggle.js'

const featureToggleIds = Object.values(FeatureToggleHelper.featureToggles).map(
  (feature) => feature.id
)

const toggleFeatureController = {
  options: {
    id: 'admin/features/{featureName}/toggle',
    validate: {
      params: Joi.object({
        featureName: Joi.string()
          .valid(...featureToggleIds)
          .required()
      }),
      failAction: () => Boom.boomify(Boom.badData())
    }
  },
  handler: async (request, h) => {
    const featureName = request.params.featureName
    await request.featureToggles.toggle(featureName)

    return h.redirect(`/admin/features`)
  }
}

export { toggleFeatureController }
