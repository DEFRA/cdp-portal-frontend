import { service } from './service/routes.js'
import { listServices } from './list/routes.js'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([listServices, service])
    }
  }
}

export { services }
