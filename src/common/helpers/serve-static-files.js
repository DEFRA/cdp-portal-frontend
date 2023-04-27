import { appConfig } from '~/src/config'

const serveStaticFiles = {
  plugin: {
    name: 'Serve static files',
    register: async (server) => {
      server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
          directory: {
            path: '.',
            redirectToSlash: true
          }
        },
        config: {
          cache: {
            expiresIn: appConfig.get('staticCacheTimeout'),
            privacy: 'private'
          }
        }
      })
    }
  }
}

export { serveStaticFiles }
