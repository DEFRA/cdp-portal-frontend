import { aboutTestSuite } from '~/src/server/test-suites/test-suite/about/routes.js'
import { listTestSuites } from '~/src/server/test-suites/list/routes.js'
import { testSuiteSecrets } from '~/src/server/test-suites/test-suite/secrets/routes.js'
import { testSuiteCreateStatus } from '~/src/server/test-suites/create-status/routes.js'
import { testSuiteRuns } from '~/src/server/test-suites/test-runs/routes.js'

const testSuites = {
  plugin: {
    name: 'testSuites',
    register: async (server) => {
      await server.register([
        aboutTestSuite,
        listTestSuites,
        testSuiteCreateStatus,
        testSuiteRuns,
        testSuiteSecrets
      ])
    }
  }
}

export { testSuites }
