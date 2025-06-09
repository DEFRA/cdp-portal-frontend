import { provideEntityExtension } from '~/src/server/common/helpers/extensions.js'
import { entityStatusController } from '~/src/server/common/patterns/entities/status/controller.js'
import { REPOSITORY } from '~/src/server/common/patterns/entities/tabs/constants.js'

const repositories = {
  plugin: {
    name: 'repositories',
    register: (server) => {
      server.ext([provideEntityExtension])

      server.route([
        {
          method: 'GET',
          path: '/repositories/{serviceId}/status',
          ...entityStatusController(REPOSITORY)
        }
      ])
    }
  }
}

export { repositories }
