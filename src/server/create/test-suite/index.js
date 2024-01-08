import {
  testSuiteDetailFormController,
  testSuiteDetailController,
  testSuiteSummaryController,
  testSuiteCreateController,
  testSuiteSuccessController
} from '~/src/server/create/test-suite/controllers'

const createTestSuiteRoutes = [
  {
    method: 'GET',
    path: '/create/test-suite/detail',
    ...testSuiteDetailFormController
  },
  {
    method: 'POST',
    path: '/create/test-suite/detail',
    ...testSuiteDetailController
  },
  {
    method: 'GET',
    path: '/create/test-suite/summary',
    ...testSuiteSummaryController
  },
  {
    method: 'POST',
    path: '/create/test-suite',
    ...testSuiteCreateController
  },
  {
    method: 'GET',
    path: '/create/test-suite/success',
    ...testSuiteSuccessController
  }
]

export { createTestSuiteRoutes }
