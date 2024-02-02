import { testSuiteListController } from '~/src/server/test-suites/controllers/test-suite-list'
import { testSuiteController } from '~/src/server/test-suites/controllers/test-suite'

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
        }
      ])
    }
  }
}

export { testSuites }
