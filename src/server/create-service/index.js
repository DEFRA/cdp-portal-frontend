import {
  createServiceController,
  createServiceFormController
} from '~/src/server/create-service/controllers'

const createService = {
  plugin: {
    name: 'create service',
    register: (server) => {
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
