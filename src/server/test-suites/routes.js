import { listTestSuites } from '~/src/server/test-suites/list/routes.js'
import { testSuiteSecrets } from '~/src/server/test-suites/test-suite/secrets/routes.js'
import { testSuiteRuns } from '~/src/server/test-suites/test-runs/routes.js'
import { testSuiteProxies } from '~/src/server/test-suites/test-suite/proxy/routes.js'
import { testSuiteHome } from '~/src/server/test-suites/test-suite/home/routes.js'

const testSuites = {
  plugin: {
    name: 'testSuites',
    register: async (server) => {
      await server.register([
        testSuiteHome,
        listTestSuites,
        testSuiteRuns,
        testSuiteSecrets,
        testSuiteProxies
      ])
    }
  }
}

export { testSuites }
