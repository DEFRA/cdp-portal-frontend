import Joi from 'joi'
import Boom from '@hapi/boom'

import { shouldPoll } from '~/src/server/test-suites/helpers/should-poll.js'
import { fetchTestRuns } from '~/src/server/test-suites/helpers/fetch/fetch-test-runs.js'
import { provideCanRun } from '~/src/server/test-suites/helpers/pre/provide-can-run.js'
import { testSuiteRunResults } from '~/src/server/test-suites/transformers/test-suite-run-results.js'
import { transformTestSuiteToSummary } from '~/src/server/test-suites/transformers/test-suite-to-summary.js'
import { buildPagination } from '~/src/server/common/helpers/build-pagination.js'
import { provideTestSuite } from '~/src/server/test-suites/helpers/pre/provide-test-suite.js'
import { provideFormValues } from '~/src/server/test-suites/helpers/pre/provide-form-values.js'

const testSuiteController = {
  options: {
    id: 'test-suites/{serviceId}',
    pre: [[provideTestSuite], provideCanRun, provideFormValues],
    validate: {
      query: Joi.object({
        page: Joi.number(),
        size: Joi.number()
      }),
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const testSuite = request.pre.testSuite
    const formValues = request.pre.formValues
    const canRun = request.pre.canRun
    const serviceName = testSuite.serviceName
    const query = request.query

    const { testRuns, page, pageSize, totalPages } = await fetchTestRuns(
      serviceName,
      { page: query?.page, size: query?.size }
    )
    const rows = testRuns.map((test) => testSuiteRunResults(test, canRun))

    return h.view('test-suites/test-suite/about/views/test-suite', {
      pageTitle: `Test Suite - ${serviceName}`,
      testSuite, // TODO we have both a service and a testSuite here, we should only have 1?
      service: request.app.service,
      canRun,
      summaryList: transformTestSuiteToSummary(testSuite),
      formValues,
      owningTeamIds: testSuite.teams.map((team) => team.teamId),
      shouldPoll: shouldPoll(testRuns),
      tableData: {
        headers: [
          { id: 'version', text: 'Version', width: '5' },
          { id: 'environment', text: 'Environment', width: '5' },
          { id: 'cpu', text: 'CPU', width: '5' },
          { id: 'memory', text: 'Memory', width: '5' },
          { id: 'status', text: 'Status', width: '10' },
          { id: 'logs', text: 'Logs', width: '10' },
          { id: 'results', text: 'Results', width: '10' },
          { id: 'user', text: 'Ran By', width: '20' },
          { id: 'duration', text: 'Duration', width: '10' },
          { id: 'last-ran', text: 'Last Ran', width: '15' },
          { id: 'action', text: 'Action', width: '5' }
        ],
        rows,
        pagination: buildPagination(page, pageSize, totalPages),
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
