import Joi from 'joi'
import Boom from '@hapi/boom'
import { aboutHandler } from '~/src/server/services/service/about/about-handler.js'
import { creatingHandler } from '~/src/server/services/service/creating/creating-handler.js'

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

    if (entity === null) {
      return Boom.notFound()
    }

    switch (entity.status) {
      case 'Success':
      case 'Created':
        return await aboutHandler(request, h)
      case 'Creating':
        return await creatingHandler(request, h)
      default:
        return Boom.badImplementation('Service lookup failed')
    }
  }
}

export { serviceHomeController }
