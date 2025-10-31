import Joi from 'joi'
import Boom from '@hapi/boom'
import { repositoryNameValidation } from '@defra/cdp-validation-kit'
import { provideEntity } from '../../../common/helpers/ext/provide-entitiy.js'

export const entityDebugRoute = {
  options: {
    id: 'admin/debug/entities/{entityName}',
    pre: [provideEntity],
    validate: {
      params: Joi.object({
        entityName: repositoryNameValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const entity = request.app.entity

    if (entity == null) {
      return Boom.notFound()
    }

    return h.response(entity).type('application/json')
  }
}
