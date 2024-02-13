import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'
import {
  testSuiteController,
  testSuiteListController,
  testSuiteStatusController,
  triggerTestSuiteRunController
} from '~/src/server/test-suites/controllers'

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
          path: '/test-suites/{serviceId}',
          ...testSuiteController
        },
        {
          method: 'GET',
          path: '/test-suites/create-status/{serviceId}',
          ...testSuiteStatusController
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
