import { provideTabs } from '~/src/server/test-suites/helpers/provide-tabs.js'
import { testSuiteController } from '~/src/server/test-suites/test-suite/about/controller.js'
import { validateServiceIsATestSuite } from '~/src/server/common/helpers/validate-service-is-a-test-suite.js'
import { provideServiceExtension } from '~/src/server/common/helpers/extensions.js'

const aboutTestSuite = {
  plugin: {
    name: 'aboutTestSuite',
    register: (server) => {
      server.ext([
        provideServiceExtension,
        {
          type: 'onPreHandler',
          method: validateServiceIsATestSuite,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideTabs,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

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
