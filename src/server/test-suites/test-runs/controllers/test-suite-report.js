import Joi from 'joi'
import Boom from '@hapi/boom'
import { iframeS3FileHandler } from '~/src/server/test-suites/helpers/iframe-s3-file-handler.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'

const testSuiteReportController = {
  options: {
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...getAllEnvironmentKebabNames()),
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

    return iframeS3FileHandler(request, h, key, bucket)
  }
}

export { testSuiteReportController }
