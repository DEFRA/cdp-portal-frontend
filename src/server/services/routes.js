import { aboutService } from '~/src/server/services/about/routes.js'
import { serviceSecrets } from '~/src/server/services/secrets/routes.js'
import { serviceTerminal } from '~/src/server/services/terminal/routes.js'
import { serviceBuckets } from '~/src/server/services/buckets/routes.js'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([
        aboutService,
        serviceSecrets,
        serviceBuckets,
        serviceTerminal
      ])
    }
  }
}

export { services }
