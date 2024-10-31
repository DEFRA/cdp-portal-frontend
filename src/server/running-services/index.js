import { runningServicesListController } from '~/src/server/running-services/controllers/index.js'

const runningServices = {
  plugin: {
    name: 'running services',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/running-services',
          ...runningServicesListController
        }
      ])
    }
  }
}

export { runningServices }
