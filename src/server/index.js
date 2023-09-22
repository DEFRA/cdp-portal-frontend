import path from 'path'
import hapi from '@hapi/hapi'
import qs from 'qs'
import Redis from 'ioredis'
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

const client = new Redis.Cluster(
  [
    {
      host: appConfig.get('cacheHost'),
      port: 6379
    }
  ],
  {
    slotsRefreshTimeout: '10000', // ten seconds
    scaleReads: 'all',
    redisOptions: {
      username: appConfig.get('cacheUsername'),
      password: appConfig.get('cachePassword'),
      db: 0,
      enableAutoPipelining: true,
      tls: {}
    }
  }
)

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

  await server.cache.provision({
    engine: new CatboxRedis({
      client,
      partition: 'cache'
    }),
    name: 'cache'
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
