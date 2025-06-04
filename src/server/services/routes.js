import { service } from '~/src/server/services/service/routes.js'
import { listServices } from '~/src/server/services/list/routes.js'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([listServices, service])
    }
  }
}

export { services }
