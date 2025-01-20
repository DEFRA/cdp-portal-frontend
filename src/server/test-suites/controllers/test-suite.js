import Joi from 'joi'
import Boom from '@hapi/boom'

import { shouldPoll } from '~/src/server/test-suites/helpers/should-poll.js'
import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch/index.js'
import { provideCanRun } from '~/src/server/test-suites/helpers/pre/provide-can-run.js'
import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite.js'
import { testSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results.js'
import { transformTestSuiteToSummary } from '~/src/server/test-suites/transformers/test-suite-to-summary.js'
import { provideEnvironmentOptions } from '~/src/server/test-suites/helpers/pre/provide-environment-options.js'

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
    const rows = testRuns.map((test) => testSuiteRunResults(test, canRun))

    return h.view('test-suites/views/test-suite', {
      pageTitle: `Test Suite - ${serviceName}`,
      testSuite,
      canRun,
      summaryList: transformTestSuiteToSummary(testSuite),
      environmentOptions,
      owningTeamIds: testSuite.teams.map((testsuite) => testsuite.teamId),
      shouldPoll: shouldPoll(testRuns),
      tableData: {
        headers: [
          { id: 'version', text: 'Version', width: '5' },
          { id: 'environment', text: 'Environment', width: '15' },
          { id: 'status', text: 'Status', width: '5' },
          { id: 'logs', text: 'Logs', width: '15' },
          { id: 'results', text: 'Results', width: '10' },
          { id: 'user', text: 'User', width: '20' },
          { id: 'duration', text: 'Duration', width: '5' },
          { id: 'last-ran', text: 'Last Ran', width: '15' },
          { id: 'action', text: 'Action', width: '10' }
        ],
        rows,
        noResult: 'No test suite run results found'
      },
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
