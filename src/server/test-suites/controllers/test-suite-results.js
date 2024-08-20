import Joi from 'joi'
import Boom from '@hapi/boom'

import { environments } from '~/src/config'
import { providePresignedUrl } from '~/src/server/test-suites/helpers/pre/provide-presigned-url'

const testSuiteResultsController = {
  options: {
    pre: [providePresignedUrl],
    validate: {
      params: Joi.object({
        serviceId: Joi.string(),
        environment: Joi.string().valid(...Object.values(environments)),
        runId: Joi.string()
      }).required(),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => h.redirect(request.pre.presignedUrl)
}

export { testSuiteResultsController }
