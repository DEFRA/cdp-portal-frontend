import { homeController } from '~/src/app/home/controller'

const home = {
  plugin: {
    name: 'home',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/',
          handler: homeController.handler
        }
      ])
    }
  }
}

export { home }
