import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { serviceHomeController } from '~/src/server/services/service/home/service-home.js'
import { SERVICE } from '~/src/server/common/patterns/entities/tabs/constants.js'
import { entityStatusController } from '~/src/server/common/patterns/entities/status/controller.js'

const serviceHome = {
  plugin: {
    name: 'serviceHome',
    register: (server) => {
      server.ext(commonServiceExtensions)

      server.route([
        {
          method: 'GET',
          path: '/services/{serviceId}',
          ...serviceHomeController
        },
        // used for xhr requests
        {
          method: 'GET',
          path: '/services/{serviceId}/status',
          ...entityStatusController(SERVICE)
        }
      ])
    }
  }
}

export { serviceHome }
