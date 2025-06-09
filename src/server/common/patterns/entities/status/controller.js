import Joi from 'joi'
import Boom from '@hapi/boom'
import { entityStatusHandler } from '~/src/server/common/patterns/entities/status/status-handler.js'
import { pluralise } from '~/src/config/nunjucks/filters/filters.js'

export function entityStatusController(entityType) {
  return {
    options: {
      id: `${pluralise(entityType)}/{serviceId}/status`,
      validate: {
        params: Joi.object({
          serviceId: Joi.string().required()
        }),
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const entity = request.app.entity

      if (entity == null) {
        return Boom.notFound()
      }

      return await entityStatusHandler(request, h, entityType)
    }
  }
}
