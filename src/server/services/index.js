import {
  serviceController,
  serviceListController,
  serviceCreateStatusController
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
          path: '/services/create-status/{serviceId}',
          ...serviceCreateStatusController
        }
      ])
    }
  }
}

export { services }
