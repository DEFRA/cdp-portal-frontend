import { testSuiteListController } from '~/src/server/test-suites/controllers/test-suite-list.js'

const listTestSuite = {
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

export { listTestSuite }
