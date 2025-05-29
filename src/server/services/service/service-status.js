import Joi from 'joi'
import Boom from '@hapi/boom'
import { creatingHandler } from '~/src/server/services/service/creating/creating-handler.js'

const serviceStatusController = {
  options: {
    id: 'services/{serviceId}/status',
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

    return await creatingHandler(request, h)
  }
}

export { serviceStatusController }
