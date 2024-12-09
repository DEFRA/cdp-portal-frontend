import { perfTestSuiteDetailController } from '~/src/server/create/perf-test-suite/controllers/detail.js'
import { perfTestSuiteDetailFormController } from '~/src/server/create/perf-test-suite/controllers/detail-form.js'
import { perfTestSuiteSummaryController } from '~/src/server/create/perf-test-suite/controllers/summary.js'
import { perfTestSuiteCreateController } from '~/src/server/create/perf-test-suite/controllers/create.js'

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
