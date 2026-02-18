import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '#config/nunjucks/filters/filters.js'
import { getAllEnvironmentKebabNames } from '#server/common/helpers/environments/get-environments.js'
import { fetchTestRun } from '#server/test-suites/helpers/fetch/fetch-test-run.js'

export const options = {
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
}

export default async function (request, h) {
  const environment = request.params.environment
  const serviceId = request.params.serviceId
  const runId = request.params.runId
  const assetPath = request.params.assetPath
  const tag = request.params.tag
  const reportInfo = `${formatText(environment)} - ${tag} report`
  const testRun = await fetchTestRun(request.params.runId)

  return {
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
  }
}
