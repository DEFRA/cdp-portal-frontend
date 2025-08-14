import { commonServiceExtensions } from '../../../common/helpers/ext/extensions.js'
import { serviceHomeController } from './service-home.js'
import { SERVICE } from '../../../common/patterns/entities/tabs/constants.js'
import { entityStatusController } from '../../../common/patterns/entities/status/controller.js'

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
