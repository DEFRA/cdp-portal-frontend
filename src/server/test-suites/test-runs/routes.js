import { testSuiteRunController } from './controllers/test-suite-run.js'
import { stopTestSuiteController } from './controllers/stop-test-suite.js'
// import { testResultsController } from './controllers/test-results.js'
import { testSuiteReportController } from './controllers/test-suite-report.js'

const testSuiteRuns = {
  plugin: {
    name: 'testSuitesRuns',
    register: (server) => {
      server.route([
        {
          method: 'POST',
          path: '/test-suites/run',
          ...testSuiteRunController
        },
        {
          method: 'POST',
          path: '/test-suites/{serviceId}/{runId}/stop',
          ...stopTestSuiteController
        },
        // {
        //   method: 'GET',
        //   path: '/test-suites/test-results/{environment}/{tag}/{serviceId}/{runId}/{assetPath*}',
        //   ...testResultsController
        // },
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
