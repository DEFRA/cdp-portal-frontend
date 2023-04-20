import {
  serviceController,
  servicesListController
} from '~/src/app/services/controllers'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/services',
          handler: servicesListController.handler
        },
        {
          method: 'GET',
          path: '/services/{serviceId}',
          handler: serviceController.handler
        }
      ])
    }
  }
}

export { services }
