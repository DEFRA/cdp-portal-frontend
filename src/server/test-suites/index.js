import { testSuiteListController } from '~/src/server/test-suites/controllers/test-suite-list'
import { testSuiteController } from '~/src/server/test-suites/controllers/test-suite'
import { triggerTestRunController } from '~/src/server/test-suites/controllers/trigger-test-run'

const testSuites = {
  plugin: {
    name: 'test-suites',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/test-suite',
          ...testSuiteListController
        },
        {
          method: 'GET',
          path: '/test-suite/{testSuiteId}',
          ...testSuiteController
        },
        {
          method: 'POST',
          path: '/test-suite/{testSuiteId}',
          ...triggerTestRunController
        }
      ])
    }
  }
}

export { testSuites }
