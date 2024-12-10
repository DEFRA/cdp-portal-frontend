import { homeController } from '~/src/server/home/controller.js'

const home = {
  plugin: {
    name: 'home',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/',
          ...homeController
        }
      ])
    }
  }
}

export { home }
