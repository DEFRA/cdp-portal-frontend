import { listServices } from '~/src/server/services/list/routes.js'
import { serviceRoutes } from '~/src/server/services/common/routes.js'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([listServices, serviceRoutes])
    }
  }
}

export { services }
