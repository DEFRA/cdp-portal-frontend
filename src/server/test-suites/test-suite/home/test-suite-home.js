import Joi from 'joi'
import Boom from '@hapi/boom'
import { aboutTestSuiteHandler } from '~/src/server/test-suites/test-suite/about/about-handler.js'
import { entityStatusHandler } from '~/src/server/common/patterns/entities/status/status-handler.js'
import { TEST_SUITE } from '~/src/server/common/patterns/entities/tabs/constants.js'
import { pluralise } from '~/src/config/nunjucks/filters/filters.js'
import { provideFormValues } from '~/src/server/test-suites/helpers/pre/provide-form-values.js'

const entityType = TEST_SUITE

const testSuiteHomeController = {
  options: {
    id: `${pluralise(entityType)}/{serviceId}`,
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

    if (entity == null) {
      return Boom.notFound()
    }

    if (entity.status === 'Creating') {
      return await entityStatusHandler(request, h, entityType)
    }
    return await aboutTestSuiteHandler(request, h)
  }
}

export { testSuiteHomeController }
