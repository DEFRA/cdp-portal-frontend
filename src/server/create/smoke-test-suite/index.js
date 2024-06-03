import {
  smokeTestSuiteDetailFormController,
  smokeTestSuiteDetailController,
  smokeTestSuiteSummaryController,
  smokeTestSuiteCreateController
} from '~/src/server/create/smoke-test-suite/controllers'

const createSmokeTestSuiteRoutes = [
  {
    method: 'GET',
    path: '/create/smoke-test-suite/detail',
    ...smokeTestSuiteDetailFormController
  },
  {
    method: 'POST',
    path: '/create/smoke-test-suite/detail',
    ...smokeTestSuiteDetailController
  },
  {
    method: 'GET',
    path: '/create/smoke-test-suite/summary',
    ...smokeTestSuiteSummaryController
  },
  {
    method: 'POST',
    path: '/create/smoke-test-suite',
    ...smokeTestSuiteCreateController
  }
]

export { createSmokeTestSuiteRoutes }
