import { servicesListController } from '~/src/server/services/list/controller.js'

const listServices = {
  plugin: {
    name: 'listServices',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/services',
          ...servicesListController
        }
      ])
    }
  }
}

export { listServices }
