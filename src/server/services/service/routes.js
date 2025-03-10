import { aboutService } from '~/src/server/services/service/about/routes.js'
import { serviceBuckets } from '~/src/server/services/service/buckets/routes.js'
import { serviceProxy } from '~/src/server/services/service/proxy/routes.js'
import { serviceSecrets } from '~/src/server/services/service/secrets/routes.js'
import { serviceTerminal } from '~/src/server/services/service/terminal/routes.js'

export const service = {
  plugin: {
    name: 'service',
    register: async (server) => {
      await server.register([
        aboutService,
        serviceBuckets,
        serviceProxy,
        serviceSecrets,
        serviceTerminal
      ])
    }
  }
}
