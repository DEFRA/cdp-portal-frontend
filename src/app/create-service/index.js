import {
  createServiceController,
  createServiceFormController
} from '~/src/app/create-service/controllers'

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
