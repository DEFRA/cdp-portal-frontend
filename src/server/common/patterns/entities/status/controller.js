import Joi from 'joi'
import Boom from '@hapi/boom'
import { entityStatusHandler } from './status-handler.js'
import { pluralise } from '../../../../../config/nunjucks/filters/filters.js'

export function entityStatusController(entityKind) {
  return {
    options: {
      id: `${pluralise(entityKind)}/{serviceId}/status`,
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

      return await entityStatusHandler(request, h, entityKind)
    }
  }
}
