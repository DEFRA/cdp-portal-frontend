import { loginController } from '~/src/server/login/controller.js'

const login = {
  plugin: {
    name: 'login',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/login',
          ...loginController
        }
      ])
    }
  }
}

export { login }
