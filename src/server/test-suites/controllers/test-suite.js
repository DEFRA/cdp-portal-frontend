import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch'
import { shouldPoll } from '~/src/server/test-suites/helpers/should-poll'
import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite'
import { transformTestSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results'
import { provideEnvironmentOptions } from '~/src/server/test-suites/helpers/pre/provide-environment-options'
import { testSuiteToEntityDataList } from '~/src/server/test-suites/transformers/test-suite-to-entity-data-list'

const testSuiteController = {
  options: {
    pre: [provideEnvironmentOptions, provideTestSuite],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const testSuite = request.pre.testSuite
    const environmentOptions = request.pre.environmentOptions
    const serviceName = testSuite.serviceName

    const testRuns = await fetchTestRuns(serviceName)
    const testSuiteRunResults = testRuns.map(transformTestSuiteRunResults)

    return h.view('test-suites/views/test-suite', {
      pageTitle: `Test Suite - ${serviceName}`,
      heading: serviceName,
      testSuite,
      entityDataList: testSuiteToEntityDataList(testSuite),
      environmentOptions,
      testSuiteRunResults,
      shouldPoll: shouldPoll(testRuns),
      breadcrumbs: [
        {
          text: 'Test suites',
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
