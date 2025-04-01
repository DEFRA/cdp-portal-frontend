import { testSuiteController } from '~/src/server/test-suites/test-suite/about/controller.js'
import { commonTestSuiteExtensions } from '~/src/server/common/helpers/extensions.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'

const aboutTestSuite = {
  plugin: {
    name: 'aboutTestSuite',
    register: (server) => {
      server.ext([
        ...commonTestSuiteExtensions,
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
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
