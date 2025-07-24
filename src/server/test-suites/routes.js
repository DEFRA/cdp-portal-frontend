import { listTestSuites } from './list/routes.js'
import { testSuiteSecrets } from './test-suite/secrets/routes.js'
import { testSuiteRuns } from './test-runs/routes.js'
import { testSuiteProxies } from './test-suite/proxy/routes.js'
import { testSuiteHome } from './test-suite/home/routes.js'

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
