import { testSuiteStatusController } from '~/src/server/test-suites/create-status/controller.js'

const testSuiteCreateStatus = {
  plugin: {
    name: 'testSuitesCreateStatus',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          // TODO align this url with the other test-suites urls: '/test-suites/{serviceId}/create-status'
          path: '/test-suites/create-status/{serviceId}',
          ...testSuiteStatusController
        }
      ])
    }
  }
}

export { testSuiteCreateStatus }
