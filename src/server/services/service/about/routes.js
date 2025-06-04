import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { aboutServiceController } from '~/src/server/services/service/about/controller.js'

const aboutService = {
  plugin: {
    name: 'aboutService',
    register: (server) => {
      server.ext(commonServiceExtensions)

      server.route([
        {
          method: 'GET',
          path: '/services/{serviceId}',
          ...aboutServiceController
        }
      ])
    }
  }
}

export { aboutService }
