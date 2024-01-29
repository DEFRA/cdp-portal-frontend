import {
  serviceController,
  serviceListController,
  serviceStatusController,
  envTestSuiteStatusController
} from '~/src/server/services/controllers'

const services = {
  plugin: {
    name: 'services',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/services',
          ...serviceListController
        },
        {
          method: 'GET',
          path: '/services/{serviceId}',
          ...serviceController
        },
        {
          method: 'GET',
          // TODO once we know where environment test suites are sitting in the UI this may change
          path: '/services/env-test-suite/create-status/{serviceId}',
          ...envTestSuiteStatusController
        },
        {
          method: 'GET',
          path: '/services/create-status/{serviceId}',
          ...serviceStatusController
        }
      ])
    }
  }
}

export { services }
