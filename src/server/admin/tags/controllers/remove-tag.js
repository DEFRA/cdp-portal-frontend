import {
  removeTagFromService
} from '~/src/server/admin/tags/helpers/fetchers.js'
import { boomify } from '@hapi/boom'
import Joi from 'joi'
import { validServiceTags } from '~/src/server/admin/tags/helpers/service-tags.js'

export const removeTagController = {
  options: {
    validate: {
      params: Joi.object({
        tag: validServiceTags
      }).unknown(true),
      query: Joi.object({
        service: Joi.string().min(1).required()
      })
    }
  },
  handler: async (request, h) => {
    const tag = request.params.tag
    const service = request.query.service

    try {
      const result = await removeTagFromService(tag, service)
      // request.logger.info(result)
    } catch (error) {
      request.logger.error(error)
      return boomify(error)
    }

    return h.redirect(`/admin/tags/${tag}/edit`)
  }
}
