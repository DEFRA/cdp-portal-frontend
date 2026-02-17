import Joi from 'joi'
import Boom from '@hapi/boom'

import { TEST_SUITE } from '#server/common/patterns/entities/tabs/constants.js'
import { pluralise } from '#server/common/helpers/pluralise.js'
import { commonTestSuiteExtensions } from '#server/common/helpers/ext/extensions.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'
import { entityStatusHandler } from '#server/common/patterns/entities/status/status-handler.js'
import { provideNotFoundIfNull } from '#server/common/helpers/ext/provide-not-found-if-null.js'
import { provideFormValues } from '#server/test-suites/helpers/pre/provide-form-values.js'
import { aboutTestSuiteHandler } from '#server/test-suites/test-suite/about/about-handler.js'

const entityType = TEST_SUITE

export const ext = [
  ...commonTestSuiteExtensions,
  {
    type: 'onPostHandler',
    method: provideFormContextValues(),
    options: {
      before: ['yar'],
      sandbox: 'plugin'
    }
  }
]

export const options = {
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
}

export async function GET(request, h) {
  const entity = request.app.entity

  if (entity.status === 'Creating') {
    return await entityStatusHandler(request, h, entityType)
  }
  return await aboutTestSuiteHandler(request, h)
}
