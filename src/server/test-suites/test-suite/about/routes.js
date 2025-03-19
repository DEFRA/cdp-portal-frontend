import { testSuiteController } from '~/src/server/test-suites/test-suite/about/controller.js'
import { commonTestSuiteExtensions } from '~/src/server/common/helpers/extensions.js'

const aboutTestSuite = {
  plugin: {
    name: 'aboutTestSuite',
    register: (server) => {
      server.ext(commonTestSuiteExtensions)

      server.route([
        {
          method: 'GET',
          path: '/test-suites/{serviceId}',
          ...testSuiteController
        }
      ])
    }
  }
}

export { aboutTestSuite }
