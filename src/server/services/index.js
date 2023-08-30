import {
  serviceController,
  serviceListController
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
        }
      ])
    }
  }
}

export { services }
