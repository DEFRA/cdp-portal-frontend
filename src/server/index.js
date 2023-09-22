import path from 'path'
import hapi from '@hapi/hapi'
import qs from 'qs'
import IoRedis from 'ioredis'
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
import { createLogger } from '~/src/server/common/helpers/logger'

const logger = createLogger()

const client = new IoRedis.Cluster(
  [
    {
      host: appConfig.get('cacheHost'),
      port: 6379
    }
  ],
  {
    slotsRefreshTimeout: 2000,
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions: {
      username: appConfig.get('cacheUsername'),
      password: appConfig.get('cachePassword'),
      db: 0,
      ...(appConfig.get('isProduction') && { tls: {} })
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

  client.on('connect', () => {
    logger.info('connected to redis server')
  })

  client.on('close', () => {
    logger.info('redis connection closed attempting reconnect')
    client.connect()
  })

  client.on('error', (error) => {
    logger.error(`redis connection error ${error}`)
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
