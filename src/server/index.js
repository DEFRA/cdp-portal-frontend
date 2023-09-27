import path from 'path'
import hapi from '@hapi/hapi'
import qs from 'qs'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'

import { router } from './router'
import { appConfig } from '~/src/config'
import { nunjucksConfig } from '~/src/config/nunjucks'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { catchAll } from '~/src/server/common/helpers/errors'
import { session } from '~/src/server/common/helpers/session'
import { requestLogger } from '~/src/server/common/helpers/request-logger'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context'
import { azureOidc } from '~/src/server/common/helpers/azure-oidc'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'
import { buildRedisClient } from '~/src/server/common/helpers/redis-client'

const client = buildRedisClient()

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
        engine: new CatboxRedis({
          partition: 'cdp-portal',
          client
        })
      }
    ]
  })

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })

  server.decorate('request', 'isXhr', isXhr)

  await server.register([session, requestLogger, azureOidc, nunjucksConfig])
  await server.register(router, {
    routes: { prefix: appConfig.get('appPathPrefix') }
  })

  server.decorate('request', 'fetchWithAuth', fetchWithAuth, { apply: true })

  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
