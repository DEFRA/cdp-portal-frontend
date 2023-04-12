const path = require('path')
const hapi = require('@hapi/hapi')
const { config } = require('../config')

const setupNunjucks = require('../config/nunjucks')
const router = require('./router')
const requestLogger = require('../common/helpers/request-logger')

async function createServer() {
  const server = hapi.server({
    port: config.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register(requestLogger)
  await server.register(router)
  await server.register(setupNunjucks)

  return server
}

module.exports = createServer
