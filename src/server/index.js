import qs from 'qs'
import path from 'path'
import hapi from '@hapi/hapi'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'

import { router } from './router'
import { config } from '~/src/config'
import { nunjucksConfig } from '~/src/config/nunjucks'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { catchAll } from '~/src/server/common/helpers/errors'
import { sessionManager } from '~/src/server/common/helpers/session-manager'
import { requestLogger } from '~/src/server/common/helpers/request-logger'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context'
import { azureOidc } from '~/src/server/common/helpers/auth/azure-oidc'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'
import { buildRedisClient } from '~/src/server/common/helpers/redis-client'
import { sessionCookie } from '~/src/server/common/helpers/auth/session-cookie'

const client = buildRedisClient()

async function createServer() {
  const server = hapi.server({
    port: config.get('port'),
    routes: {
      auth: {
        mode: 'try'
      },
      cors: true,
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
    },
    query: {
      parser: (query) => qs.parse(query)
    },
    cache: [
      {
        name: 'session',
        engine: new CatboxRedis({
          partition: 'cdp-portal',
          client
        })
      }
    ]
  })

  await server.register(sessionManager)
  await server.register(azureOidc)
  await server.register(sessionCookie)

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })

  server.decorate('request', 'isXhr', isXhr)
  server.decorate('request', 'fetchWithAuth', fetchWithAuth, { apply: true })

  await server.register(requestLogger)
  await server.register(nunjucksConfig)
  await server.register(router, {
    routes: { prefix: config.get('appPathPrefix') }
  })

  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
