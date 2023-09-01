import path from 'path'
import hapi from '@hapi/hapi'
import qs from 'qs'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import { plugin as basicAuth } from '@hapi/basic'

import { router } from './router'
import { appConfig } from '~/src/config'
import { nunjucksConfig } from '~/src/config/nunjucks'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { catchAll } from '~/src/server/common/helpers/errors'
import { flashMessage } from '~/src/server/common/helpers/flash-message'
import { requestLogger } from '~/src/server/common/helpers/request-logger'
import { validateBasicAuth } from '~/src/server/common/helpers/basic-auth'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context'

async function createServer() {
  const server = hapi.server({
    port: appConfig.get('port'),
    routes: {
      cors: true,
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
    },
    query: {
      parser: (query) => qs.parse(query)
    },
    cache: [
      {
        name: 'session',
        provider: {
          constructor: CatboxRedis,
          options: {
            partition: 'cdp-portal',
            host: appConfig.get('cacheHost'),
            port: 6379,
            db: 0,
            role: appConfig.get('cacheRole')
          }
        }
      }
    ]
  })

  // TODO this is temp auth just for the demo. Replace with proper auth before launch
  if (appConfig.get('isProduction') === true) {
    await server.register(basicAuth)

    server.auth.strategy('simple', 'basic', { validate: validateBasicAuth })
    server.auth.default('simple')
  }

  await server.register(flashMessage)
  await server.register(requestLogger)
  await server.register(router, {
    routes: { prefix: appConfig.get('appPathPrefix') }
  })

  await server.register(nunjucksConfig)

  server.decorate('request', 'isXhr', isXhr)

  server.ext('onPreResponse', addFlashMessagesToContext, { before: ['yar'] })
  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
