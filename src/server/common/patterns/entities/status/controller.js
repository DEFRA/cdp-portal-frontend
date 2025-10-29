import Joi from 'joi'
import Boom from '@hapi/boom'
import { entityStatusHandler } from './status-handler.js'
import { pluralise } from '../../../helpers/pluralise.js'
import { repositoryNameValidation } from '@defra/cdp-validation-kit'

export function entityStatusController(entityKind) {
  return {
    options: {
      id: `${pluralise(entityKind)}/{serviceId}/status`,
      validate: {
        params: Joi.object({
          serviceId: repositoryNameValidation
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
