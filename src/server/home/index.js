import { homeController } from '~/src/server/home/controller.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const home = {
  plugin: {
    name: 'home',
    register: (server) => {
      server.route(
        [
          {
            method: 'GET',
            path: '/',
            ...homeController
          }
        ].map(withTracing)
      )
    }
  }
}

export { home }
