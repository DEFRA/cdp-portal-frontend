import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import {
  testSuiteController,
  testSuiteListController,
  testSuiteStatusController,
  triggerTestSuiteRunController,
  testResultsController,
  testSuiteReportController
} from '~/src/server/test-suites/controllers/index.js'
import { stopTestSuiteController } from '~/src/server/test-suites/controllers/stop-test-suite.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

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

      server.route(
        [
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
            method: 'POST',
            path: '/test-suites/{serviceId}/{runId}/stop',
            ...stopTestSuiteController
          },
          {
            method: 'GET',
            path: '/test-suites/test-results/{environment}/{tag}/{serviceId}/{runId}/{assetPath*}',
            ...testResultsController
          },
          {
            method: 'GET',
            path: '/test-suites/report/{environment}/{serviceId}/{runId}/{assetPath*}',
            ...testSuiteReportController
          }
        ].map(withTracing)
      )
    }
  }
}

export { testSuites }
