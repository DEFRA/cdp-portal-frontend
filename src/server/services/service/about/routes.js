import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { serviceHomeController } from '~/src/server/services/service/service-home.js'
import { serviceStatusController } from '~/src/server/services/service/service-status.js'

const aboutService = {
  plugin: {
    name: 'aboutService',
    register: (server) => {
      server.ext(commonServiceExtensions)

      server.route([
        {
          method: 'GET',
          path: '/services/{serviceId}',
          ...serviceHomeController
        },
        // remove this once new status view is ready
        {
          method: 'GET',
          path: '/services/{serviceId}/status',
          ...serviceStatusController
        }
      ])
    }
  }
}

export { aboutService }
