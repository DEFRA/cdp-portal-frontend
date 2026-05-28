import Joi from 'joi'
import Boom from '@hapi/boom'
import { controllersMap } from '../../constants/controllers-map.js'

export const kindDetailController = {
  options: {
    validate: {
      params: Joi.object({
        kind: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    return controllersMap[request.params.kind].detail.handler(request, h)
  }
}
