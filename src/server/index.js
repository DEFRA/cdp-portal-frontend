import qs from 'qs'
import path from 'node:path'
import hapi from '@hapi/hapi'
import Scooter from '@hapi/scooter'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'

import { router } from '~/src/server/router.js'
import { config } from '~/src/config/index.js'
import { nunjucksConfig } from '~/src/config/nunjucks/index.js'
import { csrf } from '~/src/server/common/helpers/auth/csrf.js'
import { catchAll } from '~/src/server/common/helpers/errors/catch-all.js'
import { azureOidc } from '~/src/server/common/helpers/auth/azure-oidc.js'
import { buildRedisClient } from '~/src/server/common/helpers/redis-client.js'
import { sessionManager } from '~/src/server/common/helpers/session-manager.js'
import { sessionCookie } from '~/src/server/common/helpers/auth/session-cookie.js'
import { requestLogger } from '~/src/server/common/helpers/logging/request-logger.js'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context.js'
import { secureContext } from '~/src/server/common/helpers/secure-context/index.js'
import { sanitise } from '~/src/server/common/helpers/sanitisation/sanitise.js'
import { auditor } from '~/src/server/common/helpers/audit/auditor.js'
import { proxyAgent } from '~/src/server/common/helpers/proxy/proxy-agent.js'
import { setupWreckAgents } from '~/src/server/common/helpers/proxy/setup-wreck-agents.js'
import { pulse } from '~/src/server/common/helpers/pulse.js'
import { addDecorators } from '~/src/server/common/helpers/add-decorators.js'
import { s3Client } from '~/src/server/common/helpers/aws/s3-client.js'
import { contentSecurityPolicy } from '~/src/server/common/helpers/csp/content-security-policy.js'
import { requestTracing } from '~/src/server/common/helpers/request-tracing.js'

const enableSecureContext = config.get('enableSecureContext')

async function createServer() {
  setupWreckAgents(proxyAgent())

  const redisClient = buildRedisClient(config.get('redis'))

  const server = hapi.server({
    port: config.get('port'),
    routes: {
      auth: {
        mode: 'try'
      },
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
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
          client: redisClient
        })
      },
      {
        name: 'featureToggles',
        engine: new CatboxRedis({
          client: redisClient
        })
      }
    ],
    state: {
      strictHeader: false
    }
  })

  // TODO refactor cache and decorate it on to server and request. No need for it to be on server.app
  server.app.cache = server.cache({
    cache: 'session',
    segment: config.get('serverCacheSegment'),
    expiresIn: config.get('redis.ttl')
  })

  server.app.featureToggles = server.cache({
    cache: 'featureToggles',
    segment: config.get('featureToggles.segment'),
    expiresIn: config.get('featureToggles.ttl')
  })

  addDecorators(server)

  // Add tracer and request logger before all other plugins
  await server.register([requestTracing, requestLogger])

  if (enableSecureContext) {
    await server.register(secureContext)
  }

  await server.register([
    pulse,
    sessionManager,
    azureOidc,
    sessionCookie,
    Scooter,
    contentSecurityPolicy,
    csrf,
    nunjucksConfig,
    sanitise,
    router,
    auditor,
    s3Client
  ])

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })
  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
