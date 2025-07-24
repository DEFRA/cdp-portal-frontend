import { perfTestSuiteDetailController } from './controllers/detail.js'
import { perfTestSuiteDetailFormController } from './controllers/detail-form.js'
import { perfTestSuiteSummaryController } from './controllers/summary.js'
import { perfTestSuiteCreateController } from './controllers/create.js'

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
