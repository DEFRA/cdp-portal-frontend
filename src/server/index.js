import qs from 'qs'
import path from 'path'
import hapi from '@hapi/hapi'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'

import { router } from '~/src/server/router'
import { config } from '~/src/config'
import { nunjucksConfig } from '~/src/config/nunjucks'
import { csrf } from '~/src/server/common/helpers/auth/csrf'
import { catchAll } from '~/src/server/common/helpers/errors'
import { azureOidc } from '~/src/server/common/helpers/auth/azure-oidc'
import { buildRedisClient } from '~/src/server/common/helpers/redis-client'
import { sessionManager } from '~/src/server/common/helpers/session-manager'
import { sessionCookie } from '~/src/server/common/helpers/auth/session-cookie'
import { requestLogger } from '~/src/server/common/helpers/logging/request-logger'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context'
import { secureContext } from '~/src/server/common/helpers/secure-context'
import { sanitise } from '~/src/server/common/helpers/sanitisation/sanitise'
import { auditor } from '~/src/server/common/helpers/audit/auditor'
import { proxyAgent } from '~/src/server/common/helpers/proxy/proxy-agent'
import { setupWreckAgents } from '~/src/server/common/helpers/proxy/setup-wreck-agents'
import { pulse } from '~/src/server/common/helpers/pulse'
import { addServerMethods } from '~/src/server/common/helpers/add-server-methods'
import { addDecorators } from '~/src/server/common/helpers/add-decorators'

const enableSecureContext = config.get('enableSecureContext')
const enablePulse = config.get('enablePulse')

async function createServer() {
  setupWreckAgents(proxyAgent())

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
          client: buildRedisClient(config.get('redis'))
        })
      }
    ]
  })

  // TODO refactor cache and decorate it on to server and request. No need for it to be on server.app
  server.app.cache = server.cache({
    cache: 'session',
    segment: config.get('serverCacheSegment'),
    expiresIn: config.get('redis.ttl')
  })

  addDecorators(server)

  // Add request logger before all other plugins, so we can see errors
  await server.register(requestLogger)

  if (enableSecureContext) {
    await server.register(secureContext)
  }

  if (enablePulse) {
    await server.register(pulse)
  }

  await server.register([
    sessionManager,
    azureOidc,
    sessionCookie,
    csrf,
    nunjucksConfig,
    sanitise,
    router,
    {
      plugin: auditor,
      options: { audit: config.get('audit') }
    }
  ])

  addServerMethods(server)

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })
  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
