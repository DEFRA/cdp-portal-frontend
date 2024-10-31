import Joi from 'joi'
import Boom from '@hapi/boom'
import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'

import { environments } from '~/src/config/index.js'

const testResultsController = {
  options: {
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...Object.values(environments)),
        serviceId: Joi.string(),
        runId: Joi.string(),
        assetPath: Joi.string().required(),
        tag: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const environment = request.params.environment
    const serviceId = request.params.serviceId
    const runId = request.params.runId
    const assetPath = request.params.assetPath
    const tag = request.params.tag
    const reportInfo = `${upperFirst(kebabCase(environment))} - ${tag} report`

    return h.view('test-suites/views/test-results', {
      pageTitle: `${serviceId} - ${reportInfo}`,
      heading: serviceId,
      environment,
      serviceId,
      runId,
      assetPath,
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
