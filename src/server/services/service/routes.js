import { aboutService } from '~/src/server/services/service/about/routes.js'
import { serviceBuckets } from '~/src/server/services/service/buckets/routes.js'
import { serviceProxy } from '~/src/server/services/service/proxy/routes.js'
import { serviceSecrets } from '~/src/server/services/service/secrets/routes.js'
import { serviceTerminal } from '~/src/server/services/service/terminal/routes.js'
import { serviceAutomations } from '~/src/server/services/service/automations/routes.js'
import { creatingService } from '~/src/server/services/service/creating/routes.js'

export const service = {
  plugin: {
    name: 'service',
    register: async (server) => {
      await server.register([
        aboutService,
        creatingService,
        serviceAutomations,
        serviceBuckets,
        serviceProxy,
        serviceSecrets,
        serviceTerminal
      ])
    }
  }
}
