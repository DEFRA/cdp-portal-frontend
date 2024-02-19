import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull } from 'lodash'

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
  handler: async (request, h) => {
    const presignedUrl = request.pre.presignedUrl

    if (!isNull(presignedUrl)) {
      return h.redirect(presignedUrl)
    }

    const failureHeading = 'S3 presigned url generation failed'

    return h
      .view('error/index', {
        pageTitle: failureHeading,
        heading: failureHeading,
        message:
          'There was a problem generating the test suite results S3 presigned url. Check logs for more info.'
      })
      .code(400)
  }
}

export { testSuiteResultsController }
