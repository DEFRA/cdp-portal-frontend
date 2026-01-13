import { shouldPoll } from '../../helpers/should-poll.js'
import { fetchTestRuns } from '../../helpers/fetch/fetch-test-runs.js'
import { testSuiteRunResults } from '../../transformers/test-suite-run-results.js'
import { transformTestSuiteToSummary } from '../../transformers/test-suite-to-summary.js'
import { buildPagination } from '../../../common/helpers/build-pagination.js'
import { fetchRepository } from '../../../common/helpers/fetch/fetch-repository.js'
import { nullify404 } from '../../../common/helpers/nullify-404.js'
import { buildOptions } from '../../../common/helpers/options/build-options.js'

async function aboutTestSuiteHandler(request, h) {
  const entity = request.app.entity
  const formValues = request.pre.formValues
  const canRun =
    (await request.userIsOwner(entity)) || (await request.userIsAdmin())

  const testSuiteName = entity.name
  const query = request.query

  const repository = await fetchRepository(entity.name).catch(nullify404)

  const { testRuns, page, pageSize, totalPages } = await fetchTestRuns(
    testSuiteName,
    { page: query?.page, size: query?.size }
  )
  const rows = testRuns.map((test) => testSuiteRunResults(test, canRun))

  const profiles = [...new Set(testRuns.map((t) => t.profile).filter(Boolean))]
  formValues.profileOptions = buildOptions(profiles)
  if (!formValues.provideProfile) {
    formValues.provideProfile = 'false'
  }

  return h.view('test-suites/test-suite/about/views/test-suite', {
    pageTitle: `Test Suite - ${testSuiteName}`,
    entity,
    repository,
    canRun,
    summaryList: transformTestSuiteToSummary(entity, repository),
    formValues,
    shouldPoll: shouldPoll(testRuns),
    tableData: {
      headers: [
        { id: 'version', text: 'Version', width: '5' },
        { id: 'environment', text: 'Env', width: '7' },
        { id: 'cpu', text: 'CPU', width: '5' },
        { id: 'memory', text: 'Memory', width: '5' },
        { id: 'profile', text: 'Profile', width: '5' },
        { id: 'status', text: 'Status', width: '7' },
        { id: 'logs', text: 'Logs', width: '10' },
        { id: 'results', text: 'Results', width: '8' },
        { id: 'user', text: 'Run By', width: '12' },
        { id: 'duration', text: 'Duration', width: '10' },
        { id: 'last-run', text: 'Last Run', width: '15' },
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
        text: testSuiteName
      }
    ]
  })
}

export { aboutTestSuiteHandler }
