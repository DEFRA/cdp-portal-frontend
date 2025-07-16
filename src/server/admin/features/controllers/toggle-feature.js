import Joi from 'joi'
import Boom from '@hapi/boom'
import { updateFeatureToggle } from '~/src/server/admin/features/helpers/fetch-feature-toggles.js'

const toggleFeatureController = {
  options: {
    id: 'admin/features/{featureId}/toggle/{active}',
    validate: {
      params: Joi.object({
        featureId: Joi.string().required(),
        active: Joi.boolean().required()
      }),
      failAction: () => Boom.boomify(Boom.badData())
    }
  },
  handler: async (request, h) => {
    await updateFeatureToggle(request.params.featureId, request.params.active)

    return h.redirect(`/admin/features`)
  }
}

export { toggleFeatureController }
