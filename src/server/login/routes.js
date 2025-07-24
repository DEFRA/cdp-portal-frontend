import { loginController } from './controller.js'

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
