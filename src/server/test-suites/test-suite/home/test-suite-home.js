import Joi from 'joi'
import Boom from '@hapi/boom'
import { aboutTestSuiteHandler } from '../about/about-handler.js'
import { entityStatusHandler } from '#server/common/patterns/entities/status/status-handler.js'
import { TEST_SUITE } from '#server/common/patterns/entities/tabs/constants.js'
import { pluralise } from '#server/common/helpers/pluralise.js'
import { provideFormValues } from '../../helpers/pre/provide-form-values.js'
import { provideNotFoundIfNull } from '#server/common/helpers/ext/provide-not-found-if-null.js'

const entityType = TEST_SUITE

const testSuiteHomeController = {
  options: {
    id: `${pluralise(entityType)}/{serviceId}`,
    ext: { onPreAuth: [provideNotFoundIfNull] },
    pre: [provideFormValues],
    validate: {
      query: Joi.object({
        page: Joi.number(),
        size: Joi.number()
      }),
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const entity = request.app.entity

    if (entity.status === 'Creating') {
      return await entityStatusHandler(request, h, entityType)
    }
    return await aboutTestSuiteHandler(request, h)
  }
}

export { testSuiteHomeController }
