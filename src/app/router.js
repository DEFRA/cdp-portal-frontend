const { home } = require('./home/routes')
const { about } = require('./about/routes')
const { serveStaticFiles } = require('../common/helpers/serve-static-files')

module.exports = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register(require('@hapi/inert'))

      server.route([home, about, serveStaticFiles])
    }
  }
}
