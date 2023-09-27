import { appConfig } from '~/src/config'

const serveStaticFiles = {
  plugin: {
    name: 'staticFiles',
    register: async (server) => {
      server.route({
        options: {
          auth: false,
          cache: {
            expiresIn: appConfig.get('staticCacheTimeout'),
            privacy: 'private'
          }
        },
        method: 'GET',
        path: '/public/{param*}',
        handler: {
          directory: {
            path: '.',
            redirectToSlash: true
          }
        }
      })
    }
  }
}

export { serveStaticFiles }
