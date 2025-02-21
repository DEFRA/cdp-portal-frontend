import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'
import { fetchTestRun } from '~/src/server/test-suites/helpers/fetch/index.js'

const testResultsController = {
  options: {
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...getAllEnvironmentKebabNames()),
        serviceId: Joi.string(),
        runId: Joi.string(),
        assetPath: Joi.string().required(),
        tag: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params.environment
    const serviceId = request.params.serviceId
    const runId = request.params.runId
    const assetPath = request.params.assetPath
    const tag = request.params.tag
    const reportInfo = `${formatText(environment)} - ${tag} report`
    const testRun = await fetchTestRun(request.params.runId)

    return h.view('test-suites/views/test-results', {
      pageTitle: `${serviceId} - ${reportInfo}`,
      heading: serviceId,
      environment,
      serviceId,
      runId,
      assetPath,
      failureReasons: testRun?.failureReasons ?? [],
      breadcrumbs: [
        {
          text: 'Test suites',
          href: '/test-suites'
        },
        {
          text: serviceId,
          href: `/test-suites/${serviceId}`
        },
        {
          text: reportInfo
        }
      ]
    })
  }
}

export { testResultsController }
