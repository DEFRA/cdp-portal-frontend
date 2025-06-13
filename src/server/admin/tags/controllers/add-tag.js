import { addTagToService } from '~/src/server/admin/tags/helpers/fetchers.js'
import Joi from 'joi'
import { validServiceTags } from '~/src/server/admin/tags/helpers/service-tags.js'
import Boom from '@hapi/boom'

export const addTagController = {
  options: {
    validate: {
      payload: Joi.object({
        tag: validServiceTags.required(),
        service: Joi.string().min(1).required()
      }).unknown(true),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const { service, tag } = request.payload

    request.logger.info(`Adding ${tag} tag to ${service}`)
    await addTagToService(tag, service)

    return h.redirect(`/admin/tags/${tag}`)
  }
}
