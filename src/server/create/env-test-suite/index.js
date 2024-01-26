import {
  envTestSuiteDetailFormController,
  envTestSuiteDetailController,
  envTestSuiteSummaryController,
  envTestSuiteCreateController,
  envTestSuiteSuccessController
} from '~/src/server/create/env-test-suite/controllers'

const createEnvTestSuiteRoutes = [
  {
    method: 'GET',
    path: '/create/env-test-suite/detail',
    ...envTestSuiteDetailFormController
  },
  {
    method: 'POST',
    path: '/create/env-test-suite/detail',
    ...envTestSuiteDetailController
  },
  {
    method: 'GET',
    path: '/create/env-test-suite/summary',
    ...envTestSuiteSummaryController
  },
  {
    method: 'POST',
    path: '/create/env-test-suite',
    ...envTestSuiteCreateController
  },
  {
    method: 'GET',
    path: '/create/env-test-suite/success',
    ...envTestSuiteSuccessController
  }
]

export { createEnvTestSuiteRoutes }
