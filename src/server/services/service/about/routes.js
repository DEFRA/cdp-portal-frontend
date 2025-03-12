import { serviceController } from '~/src/server/services/service/about/controllers/service.js'
import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'

const aboutService = {
  plugin: {
    name: 'aboutService',
    register: (server) => {
      server.ext(commonServiceExtensions)

      server.route([
        {
          method: 'GET',
          path: '/services/{serviceId}',
          ...serviceController
        }
      ])
    }
  }
}

export { aboutService }
