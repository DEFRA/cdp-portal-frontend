import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch/index.js'
import { shouldPoll } from '~/src/server/test-suites/helpers/should-poll.js'
import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite.js'
import { transformTestSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results.js'
import { provideEnvironmentOptions } from '~/src/server/test-suites/helpers/pre/provide-environment-options.js'
import { testSuiteToEntityDataList } from '~/src/server/test-suites/transformers/test-suite-to-entity-data-list.js'
import { provideCanRun } from '~/src/server/test-suites/helpers/pre/provide-can-run.js'

const testSuiteController = {
  options: {
    pre: [[provideTestSuite], provideEnvironmentOptions, provideCanRun],
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
    const canRun = request.pre.canRun
    const serviceName = testSuite.serviceName

    const testRuns = await fetchTestRuns(serviceName)

    const testSuiteRunResults = testRuns.map((test) =>
      transformTestSuiteRunResults(test, canRun)
    )

    return h.view('test-suites/views/test-suite', {
      pageTitle: `Test Suite - ${serviceName}`,
      heading: serviceName,
      testSuite,
      canRun,
      entityDataList: testSuiteToEntityDataList(testSuite),
      environmentOptions,
      testSuiteRunResults,
      owningTeamIds: testSuite.teams.map((testsuite) => testsuite.teamId),
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
