import { logoutController } from '~/src/server/logout/controller.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const logout = {
  plugin: {
    name: 'logout',
    register: (server) => {
      server.route(
        [
          {
            method: 'GET',
            path: '/logout',
            ...logoutController
          }
        ].map(withTracing)
      )
    }
  }
}

export { logout }
