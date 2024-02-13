import { testSuiteListController } from '~/src/server/test-suites/controllers/test-suite-list'
import { testSuiteController } from '~/src/server/test-suites/controllers/test-suite'
import { triggerTestSuiteRunController } from '~/src/server/test-suites/controllers/trigger-test-suite-run'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'

const testSuites = {
  plugin: {
    name: 'test-suites',
    register: (server) => {
      server.ext([
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
          path: '/test-suites',
          ...testSuiteListController
        },
        {
          method: 'GET',
          path: '/test-suites/{testSuiteId}',
          ...testSuiteController
        },
        {
          method: 'POST',
          path: '/test-suites/run',
          ...triggerTestSuiteRunController
        }
      ])
    }
  }
}

export { testSuites }
