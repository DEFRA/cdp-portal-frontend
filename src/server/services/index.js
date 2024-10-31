import { aboutService } from '~/src/server/services/about/index.js'
import { serviceSecrets } from '~/src/server/services/secrets/index.js'
import { serviceTerminal } from '~/src/server/services/terminal/index.js'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([aboutService, serviceSecrets, serviceTerminal])
    }
  }
}

export { services }
