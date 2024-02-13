import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite'
import { transformServiceToEntityDataList } from '~/src/server/common/transformers/transform-service-to-entity-data-list'
import { buildOptions } from '~/src/server/common/helpers/build-options'
// TODO move to /common
import { fetchEnvironments } from '~/src/server/deploy-service/helpers/fetch/fetch-environments'
import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch'
import { transformTestSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results'

const testSuiteController = {
  options: {
    pre: [provideTestSuite],
    validate: {
      params: Joi.object({
        testSuiteId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const testSuite = request.pre.testSuite
    const serviceName = testSuite.serviceName

    const environmentOptions = buildOptions(await fetchEnvironments(request))
    const testRuns = await fetchTestRuns(serviceName)

    return h.view('test-suites/views/test-suite', {
      pageTitle: `Test Suite - ${serviceName}`,
      heading: serviceName,
      testSuite,
      entityDataList: transformServiceToEntityDataList(testSuite),
      environmentOptions,
      testSuiteRunResults: testRuns.map(transformTestSuiteRunResults),
      breadcrumbs: [
        {
          text: 'Tests',
          href: '/test-suites'
        },
        {
          text: serviceName
        }
      ]
    })
  }
}

export { testSuiteController }
