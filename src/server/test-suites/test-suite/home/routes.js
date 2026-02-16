import { commonTestSuiteExtensions } from '#server/common/helpers/ext/extensions.js'
import { TEST_SUITE } from '#server/common/patterns/entities/tabs/constants.js'
import { entityStatusController } from '#server/common/patterns/entities/status/controller.js'
import { testSuiteHomeController } from './test-suite-home.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'

const testSuiteHome = {
  plugin: {
    name: 'testSuiteHome',
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
          ...testSuiteHomeController
        },
        // used for xhr requests
        {
          method: 'GET',
          path: '/test-suites/{serviceId}/status',
          ...entityStatusController(TEST_SUITE)
        }
      ])
    }
  }
}

export { testSuiteHome }
