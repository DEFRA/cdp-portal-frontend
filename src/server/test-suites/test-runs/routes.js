import { triggerTestSuiteRunController } from '~/src/server/test-suites/test-runs/controllers/test-suite-run.js'
import { stopTestSuiteController } from '~/src/server/test-suites/test-runs/controllers/stop-test-suite.js'
import { testResultsController } from '~/src/server/test-suites/test-runs/controllers/test-results.js'
import { testSuiteReportController } from '~/src/server/test-suites/test-runs/controllers/test-suite-report.js'

const testSuiteRuns = {
  plugin: {
    name: 'testSuitesRuns',
    register: (server) => {
      server.route([
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

export { testSuiteRuns }
