import path from 'path'
import hapi from '@hapi/hapi'
import { appConfig } from '~/src/config'

import { nunjucksConfig } from '~/src/config/nunjucks'
import { router } from './router'
import { requestLogger } from '~/src/common/helpers/request-logger'
import { catchAll } from '~/src/common/helpers/errors'

async function createServer() {
  const server = hapi.server({
    port: appConfig.get('port'),
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(appConfig.get('root'), '.public')
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register(requestLogger)

  await server.register(router, {
    routes: { prefix: appConfig.get('appPathPrefix') }
  })

  await server.register(nunjucksConfig)

  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
