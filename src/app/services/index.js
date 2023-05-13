import {
  serviceController,
  serviceListController
} from '~/src/app/services/controllers'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
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
        }
      ])
    }
  }
}

export { services }
