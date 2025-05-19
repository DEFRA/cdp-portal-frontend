import { serviceCreateStatusController } from '~/src/server/services/create-status/controller.js'

const createStatus = {
  plugin: {
    name: 'createStatus',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          // TODO align this url with the other services urls: '/services/{serviceId}/create-status'
          path: '/services/create-status/{serviceId}',
          ...serviceCreateStatusController
        }
      ])
    }
  }
}

export { createStatus }
