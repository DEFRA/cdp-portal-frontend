import { runningServicesListController } from '~/src/server/running-services/controllers'

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
