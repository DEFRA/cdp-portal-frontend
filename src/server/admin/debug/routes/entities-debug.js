import Joi from 'joi'
import Boom from '@hapi/boom'
import {
  entityStatusValidation,
  entityTypeValidation,
  teamIdValidation
} from '@defra/cdp-validation-kit'
import { fetchEntities } from '../../../common/helpers/fetch/fetch-entities.js'

export const entitiesDebugRoute = {
  options: {
    id: 'admin/debug/entities',
    validate: {
      query: Joi.object({
        type: Joi.alternatives()
          .try(Joi.array().items(entityTypeValidation), entityTypeValidation)
          .optional(),
        status: Joi.alternatives()
          .try(
            Joi.array().items(entityStatusValidation),
            entityStatusValidation
          )
          .optional(),
        teamIds: Joi.alternatives()
          .try(Joi.array().items(teamIdValidation), teamIdValidation)
          .optional(),
        summary: Joi.bool().optional()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const entities = await fetchEntities(request.query)

    return h.response(entities).type('application/json')
  }
}
