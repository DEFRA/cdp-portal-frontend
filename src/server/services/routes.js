import { service } from '~/src/server/services/service/routes.js'
import { listServices } from '~/src/server/services/list/routes.js'
import { createStatus } from '~/src/server/services/create-status/routes.js'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([createStatus, listServices, service])
    }
  }
}

export { services }
