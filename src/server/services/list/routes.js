import { serviceListController } from '~/src/server/services/list/controller.js'

const listServices = {
  plugin: {
    name: 'listServices',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/services',
          ...serviceListController
        }
      ])
    }
  }
}

export { listServices }
