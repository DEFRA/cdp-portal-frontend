import { documentationController } from '~/src/server/documentation/controller.js'

const documentation = {
  plugin: {
    name: 'documentation',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/documentation',
          handler: (_request, h) => h.redirect('/documentation/README.md')
        },
        {
          method: 'GET',
          path: '/documentation/{documentationPath*}',
          ...documentationController
        }
      ])
    }
  }
}

export { documentation }
