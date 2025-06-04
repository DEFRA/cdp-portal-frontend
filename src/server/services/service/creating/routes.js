import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { serviceStatusController } from '~/src/server/services/service/creating/controller.js'

const creatingService = {
  plugin: {
    name: 'creatingService',
    register: (server) => {
      server.ext(commonServiceExtensions)

      server.route([
        {
          method: 'GET',
          path: '/services/{serviceId}/status',
          ...serviceStatusController
        }
      ])
    }
  }
}

export { creatingService }
