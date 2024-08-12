import { loginController } from '~/src/server/login/controller'
import { githubLogin } from '~/src/server/login/github'

const login = {
  plugin: {
    name: 'login',
    register: async (server) => {
      await server.register([githubLogin])

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
