import { authCallbackController } from './auth-callback-controller.js'

export const authCallback = {
  plugin: {
    name: 'auth',
    register: (server) => {
      server.route([
        {
          method: ['POST'],
          path: '/auth/callback',
          handler: authCallbackController.handler,
          options: {
            auth: false,
            plugins: {
              crumb: false
            },
            payload: {
              parse: true,
              allow: 'application/x-www-form-urlencoded'
            }
          }
        },
        {
          method: ['GET'],
          path: '/auth/callback',
          handler: authCallbackController.handler,
          options: {
            auth: false
          }
        }
      ])
    }
  }
}
