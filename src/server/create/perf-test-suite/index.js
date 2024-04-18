import {
  perfTestSuiteDetailFormController,
  perfTestSuiteDetailController,
  perfTestSuiteSummaryController,
  perfTestSuiteCreateController
} from '~/src/server/create/perf-test-suite/controllers'

const createPerfTestSuiteRoutes = [
  {
    method: 'GET',
    path: '/create/perf-test-suite/detail',
    ...perfTestSuiteDetailFormController
  },
  {
    method: 'POST',
    path: '/create/perf-test-suite/detail',
    ...perfTestSuiteDetailController
  },
  {
    method: 'GET',
    path: '/create/perf-test-suite/summary',
    ...perfTestSuiteSummaryController
  },
  {
    method: 'POST',
    path: '/create/perf-test-suite',
    ...perfTestSuiteCreateController
  }
]

export { createPerfTestSuiteRoutes }
