import {
  authCallbackController,
  refreshTokenController
} from '~/src/server/auth/controller.js'

const auth = {
  plugin: {
    name: 'auth',
    register: (server) => {
      server.route([
        {
          method: ['GET', 'POST'],
          path: '/auth/callback',
          ...authCallbackController
        },
        {
          method: ['GET', 'POST'],
          path: '/auth/refresh',
          ...refreshTokenController
        }
      ])
    }
  }
}

export { auth }
