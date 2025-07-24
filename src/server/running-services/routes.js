import { runningServicesListController } from './controllers/running-services-list.js'
import { runningServiceController } from './controllers/running-service.js'

const runningServices = {
  plugin: {
    name: 'running services',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/running-services',
          ...runningServicesListController
        },
        {
          method: 'GET',
          path: '/running-services/{serviceName}',
          ...runningServiceController
        }
      ])
    }
  }
}

export { runningServices }
