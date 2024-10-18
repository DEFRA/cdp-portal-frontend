import { aboutService } from '~/src/server/services/about'
import { serviceSecrets } from '~/src/server/services/secrets'
import { serviceTerminal } from '~/src/server/services/terminal'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([aboutService, serviceSecrets, serviceTerminal])
    }
  }
}

export { services }
