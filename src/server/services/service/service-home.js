import Joi from 'joi'
import Boom from '@hapi/boom'
import { aboutHandler } from '~/src/server/services/service/about/about-handler.js'

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

    return await aboutHandler(request, h)
  }
}

export { serviceHomeController }
