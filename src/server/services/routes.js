import { listServices } from '~/src/server/services/list/routes.js'
import { aboutService } from '~/src/server/services/about/routes.js'
import { serviceProxyRules } from '~/src/server/services/proxy-rules/routes.js'
import { serviceSecrets } from '~/src/server/services/secrets/routes.js'
import { serviceTerminal } from '~/src/server/services/terminal/routes.js'
import { serviceBuckets } from '~/src/server/services/buckets/routes.js'

const services = {
  plugin: {
    name: 'services',
    register: async (server) => {
      await server.register([
        listServices,
        aboutService,
        serviceBuckets,
        serviceProxyRules,
        serviceSecrets,
        serviceTerminal
      ])
    }
  }
}

export { services }
