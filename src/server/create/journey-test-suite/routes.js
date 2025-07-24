import { testSuiteDetailController } from './controllers/detail.js'
import { testSuiteDetailFormController } from './controllers/detail-form.js'
import { testSuiteSummaryController } from './controllers/summary.js'
import { testSuiteCreateController } from './controllers/create.js'

const createJourneyTestSuiteRoutes = [
  {
    method: 'GET',
    path: '/create/journey-test-suite/detail',
    ...testSuiteDetailFormController
  },
  {
    method: 'POST',
    path: '/create/journey-test-suite/detail',
    ...testSuiteDetailController
  },
  {
    method: 'GET',
    path: '/create/journey-test-suite/summary',
    ...testSuiteSummaryController
  },
  {
    method: 'POST',
    path: '/create/journey-test-suite',
    ...testSuiteCreateController
  }
]

export { createJourneyTestSuiteRoutes }
