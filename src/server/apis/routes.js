import { apisListController } from './controllers/apis-list.js'

const apis = {
  plugin: {
    name: 'apis',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/apis',
          ...apisListController
        }
      ])
    }
  }
}

export { apis }
