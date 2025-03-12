import { aboutTestSuite } from '~/src/server/test-suites/test-suite/about/routes.js'
import { listTestSuite } from '~/src/server/test-suites/list/routes.js'
import { testSuiteSecrets } from '~/src/server/test-suites/test-suite/secrets/routes.js'

const testSuites = {
  plugin: {
    name: 'testSuites',
    register: async (server) => {
      await server.register([aboutTestSuite, testSuiteSecrets, listTestSuite])
    }
  }
}

// const testSuites = {
//   plugin: {
//     name: 'test-suites',
//     register: (server) => {
//       server.ext([
//         {
//           type: 'onPostHandler',
//           method: provideFormContextValues(),
//           options: {
//             before: ['yar'],
//             sandbox: 'plugin'
//           }
//         }
//       ])
//
//       server.route([
//         {
//           method: 'GET',
//           path: '/test-suites',
//           ...testSuiteListController
//         },
//         {
//           method: 'GET',
//           path: '/test-suites/{serviceId}',
//           ...testSuiteController
//         },
//         {
//           method: 'GET',
//           path: '/test-suites/create-status/{serviceId}',
//           ...testSuiteStatusController
//         },
//         {
//           method: 'POST',
//           path: '/test-suites/run',
//           ...triggerTestSuiteRunController
//         },
//         {
//           method: 'POST',
//           path: '/test-suites/{serviceId}/{runId}/stop',
//           ...stopTestSuiteController
//         },
//         {
//           method: 'GET',
//           path: '/test-suites/test-results/{environment}/{tag}/{serviceId}/{runId}/{assetPath*}',
//           ...testResultsController
//         },
//         {
//           method: 'GET',
//           path: '/test-suites/report/{environment}/{serviceId}/{runId}/{assetPath*}',
//           ...testSuiteReportController
//         }
//       ])
//     }
//   }
// }

export { testSuites }
