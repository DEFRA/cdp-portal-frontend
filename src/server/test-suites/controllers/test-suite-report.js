import Joi from 'joi'
import Boom from '@hapi/boom'

import { environments } from '~/src/config'
import { s3FileHandler } from '~/src/server/common/helpers/aws/s3-file-handler'

const testSuiteReportController = {
  options: {
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...Object.values(environments)),
        serviceId: Joi.string(),
        runId: Joi.string(),
        assetPath: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const key = decodeURIComponent(
      `${request.params.serviceId}/${request.params.runId}/${request.params.assetPath}`
    )
    const bucket = `cdp-${request.params.environment}-test-results`

    return s3FileHandler(request, h, key, bucket)
  }
}

export { testSuiteReportController }
