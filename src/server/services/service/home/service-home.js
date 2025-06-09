import Joi from 'joi'
import Boom from '@hapi/boom'
import { aboutHandler } from '~/src/server/services/service/about/about-handler.js'
import { entityStatusHandler } from '~/src/server/common/patterns/entities/status/status-handler.js'
import { SERVICE } from '~/src/server/common/patterns/entities/tabs/constants.js'

const serviceHomeController = {
  options: {
    id: 'services/{serviceId}',
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

    if (entity.status === 'Creating') {
      return await entityStatusHandler(request, h, SERVICE)
    }
    return await aboutHandler(request, h)
  }
}

export { serviceHomeController }
