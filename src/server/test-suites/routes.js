import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { testSuiteController } from '~/src/server/test-suites/controllers/test-suite.js'
import { testSuiteListController } from '~/src/server/test-suites/controllers/test-suite-list.js'
import { testSuiteStatusController } from '~/src/server/test-suites/controllers/test-suite-status.js'
import { triggerTestSuiteRunController } from '~/src/server/test-suites/controllers/trigger-test-suite-run.js'
import { testResultsController } from '~/src/server/test-suites/controllers/test-results.js'
import { testSuiteReportController } from '~/src/server/test-suites/controllers/test-suite-report.js'
import { stopTestSuiteController } from '~/src/server/test-suites/controllers/stop-test-suite.js'

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
      ])
    }
  }
}

export { testSuites }
