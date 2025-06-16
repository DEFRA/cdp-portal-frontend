import Boom from '@hapi/boom'

import { removeTagFromService } from '~/src/server/admin/tags/helpers/fetchers.js'
import { tagValidation } from '~/src/server/admin/tags/helpers/schema/tag-validation.js'

export const removeTagController = {
  options: {
    validate: {
      params: tagValidation,
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },

  handler: async (request, h) => {
    const { tag, serviceId } = request.params

    request.logger.info(`Removing ${tag} tag to ${serviceId}`)
    await removeTagFromService(tag, serviceId)

    return h.redirect(`/admin/tags/${tag}`)
  }
}
