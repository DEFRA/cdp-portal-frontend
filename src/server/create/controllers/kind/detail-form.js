import Joi from 'joi'
import Boom from '@hapi/boom'
import { controllersMap } from '../../constants/controllers-map.js'

export const kindDetailFormController = {
  options: {
    validate: {
      params: Joi.object({
        kind: Joi.string().required()
      }),
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    return controllersMap[request.params.kind].detailForm.handler(request, h)
  }
}
