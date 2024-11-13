import { loginController } from '~/src/server/login/controller.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const login = {
  plugin: {
    name: 'login',
    register: (server) => {
      server.route(
        [
          {
            method: 'GET',
            path: '/login',
            ...loginController
          }
        ].map(withTracing)
      )
    }
  }
}

export { login }
