import { addTagToService } from '~/src/server/admin/tags/helpers/fetchers.js'
import { boomify } from '@hapi/boom'
import Joi from 'joi'
import { validServiceTags } from '~/src/server/admin/tags/helpers/service-tags.js'

export const addTagController = {
  options: {
    validate: {
      payload: Joi.object({
        tag: validServiceTags.required(),
        service: Joi.string().min(1).required()
      }).unknown(true)
    }
  },
  handler: async (request, h) => {
    const { service, tag } = request.payload

    request.logger.info(`Added ${tag} tag to ${service}`)

    try {
      await addTagToService(tag, service)
    } catch (error) {
      request.logger.error(error)
      return boomify(error)
    }

    return h.redirect(`/admin/tags/${tag}/edit`)
  }
}
