import { aboutService } from '~/src/server/services/about'
import { serviceSecrets } from '~/src/server/services/secrets'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([aboutService, serviceSecrets])
    }
  }
}

export { services }
