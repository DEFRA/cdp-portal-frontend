import { authCallbackController } from '~/src/server/auth/controller.js'

const auth = {
  plugin: {
    name: 'auth',
    register: (server) => {
      server.route([
        {
          method: ['GET', 'POST'],
          path: '/auth/callback',
          ...authCallbackController
        }
      ])
    }
  }
}

export { auth }
