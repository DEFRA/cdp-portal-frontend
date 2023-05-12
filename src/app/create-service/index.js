import { createServiceController } from '~/src/app/create-service/controllers'
import { createServiceFormController } from '~/src/app/create-service/controllers/create-service-form'

const createService = {
  plugin: {
    name: 'create service',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/create-service',
          ...createServiceFormController
        },
        {
          method: 'POST',
          path: '/create-service',
          ...createServiceController
        }
      ])
    }
  }
}

export { createService }
