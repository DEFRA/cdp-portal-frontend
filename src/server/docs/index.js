import { docsController } from '~/src/server/docs/controllers'

const docs = {
  plugin: {
    name: 'docs',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/docs/{docsPath*}',
          ...docsController
        }
      ])
    }
  }
}

export { docs }
