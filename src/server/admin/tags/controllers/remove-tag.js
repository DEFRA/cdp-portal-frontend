import Boom from '@hapi/boom'

import { removeTagFromService } from '../helpers/fetchers.js'
import { tagValidation } from '../helpers/schema/tag-validation.js'

const removeTagController = {
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

export { removeTagController }
