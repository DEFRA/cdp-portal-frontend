import { authCallbackController } from '~/src/server/auth/controller.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const auth = {
  plugin: {
    name: 'auth',
    register: (server) => {
      server.route(
        withTracing({
          method: ['GET', 'POST'],
          path: '/auth/callback',
          ...authCallbackController
        })
      )
    }
  }
}

export { auth }
