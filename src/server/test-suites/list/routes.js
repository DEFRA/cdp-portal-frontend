import { testSuiteListController } from '~/src/server/test-suites/list/controller.js'

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
