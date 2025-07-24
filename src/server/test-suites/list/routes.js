import { testSuiteListController } from './controller.js'

const listTestSuites = {
  plugin: {
    name: 'listTestSuite',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/test-suites',
          ...testSuiteListController
        }
      ])
    }
  }
}

export { listTestSuites }
