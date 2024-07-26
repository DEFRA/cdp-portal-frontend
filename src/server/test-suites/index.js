import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'
import {
  testSuiteController,
  testSuiteListController,
  testSuiteStatusController,
  triggerTestSuiteRunController,
  testSuiteResultsController
} from '~/src/server/test-suites/controllers'
import { stopTestSuiteController } from '~/src/server/test-suites/controllers/stop-test-suite'

const testSuites = {
  plugin: {
    name: 'test-suites',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/test-suites',
          ...testSuiteListController
        },
        {
          method: 'GET',
          path: '/test-suites/{serviceId}',
          ...testSuiteController
        },
        {
          method: 'GET',
          path: '/test-suites/create-status/{serviceId}',
          ...testSuiteStatusController
        },
        {
          method: 'POST',
          path: '/test-suites/run',
          ...triggerTestSuiteRunController
        },
        {
          method: 'GET',
          path: '/test-suites/test-results/{environment}/{serviceId}/{runId}',
          ...testSuiteResultsController
        },
        {
          method: 'POST',
          path: '/test-suites/{serviceId}/{runId}/stop',
          ...stopTestSuiteController
        }
      ])
    }
  }
}

export { testSuites }
