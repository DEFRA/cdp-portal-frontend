import { removeTagFromService } from '~/src/server/admin/tags/helpers/fetchers.js'
import Joi from 'joi'
import { validServiceTags } from '~/src/server/admin/tags/helpers/service-tags.js'
import Boom from '@hapi/boom'

export const removeTagController = {
  options: {
    validate: {
      params: Joi.object({
        tag: validServiceTags
      }),
      query: Joi.object({
        service: Joi.string().min(1).required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const tag = request.params.tag
    const service = request.query.service

    request.logger.info(`Removing ${tag} tag to ${service}`)
    await removeTagFromService(tag, service)

    return h.redirect(`/admin/tags/${tag}`)
  }
}
