import {
  testSuiteDetailFormController,
  testSuiteDetailController,
  testSuiteSummaryController,
  testSuiteCreateController
} from '~/src/server/create/journey-test-suite/controllers/index.js'

const createTestSuiteRoutes = [
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

export { createTestSuiteRoutes }
