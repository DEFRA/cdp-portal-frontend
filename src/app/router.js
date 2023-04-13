const { home } = require('./home/routes')
const { about } = require('./about/routes')
const { serveStaticFiles } = require('../common/helpers/serve-static-files')
const { config } = require('../config')

module.exports = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register(require('@hapi/inert'))
      server.realm.modifiers.route.prefix = config.get('appPathPrefix')

      server.route([home, about, serveStaticFiles])
    }
  }
}
