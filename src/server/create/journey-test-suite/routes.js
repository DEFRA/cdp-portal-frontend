import { testSuiteDetailController } from '~/src/server/create/journey-test-suite/controllers/detail.js'
import { testSuiteDetailFormController } from '~/src/server/create/journey-test-suite/controllers/detail-form.js'
import { testSuiteSummaryController } from '~/src/server/create/journey-test-suite/controllers/summary.js'
import { testSuiteCreateController } from '~/src/server/create/journey-test-suite/controllers/create.js'

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
