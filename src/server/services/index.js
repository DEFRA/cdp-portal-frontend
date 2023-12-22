import {
  serviceController,
  serviceListController,
  finishController
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
          method: 'POST',
          path: '/services/finish/{serviceId}',
          ...finishController
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
