import { serviceHome } from './home/routes.js'
import { serviceProxy } from './proxy/routes.js'
import { serviceSecrets } from './secrets/routes.js'
import { serviceTerminal } from './terminal/routes.js'
import { serviceAutomations } from './automations/routes.js'
import { serviceMaintenance } from './maintenance/routes.js'
import { serviceResources } from './resources/routes.js'

export const service = {
  plugin: {
    name: 'service',
    register: async (server) => {
      await server.register([
        serviceHome,
        serviceAutomations,
        serviceProxy,
        serviceResources,
        serviceSecrets,
        serviceMaintenance,
        serviceTerminal
      ])
    }
  }
}
