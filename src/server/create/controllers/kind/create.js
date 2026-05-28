import Joi from 'joi'
import Boom from '@hapi/boom'
import { controllersMap } from '../../constants/controllers-map.js'
import { scopes } from '@defra/cdp-validation-kit'

export const kindCreateController = {
  options: {
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, 'team:{payload.teamId}']
      }
    },
    validate: {
      params: Joi.object({
        kind: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    return controllersMap[request.params.kind].create.handler(request, h)
  }
}
