import qs from 'qs'
import path from 'node:path'
import hapi from '@hapi/hapi'
import Scooter from '@hapi/scooter'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'

import { router } from '~/src/server/router.js'
import { config } from '~/src/config/config.js'
import { nunjucksConfig } from '~/src/config/nunjucks/index.js'
import { csrf } from '~/src/server/common/helpers/auth/csrf.js'
import { catchAll } from '~/src/server/common/helpers/errors/catch-all.js'
import { azureOidc } from '~/src/server/common/helpers/auth/azure-oidc.js'
import { buildRedisClient } from '~/src/server/common/helpers/redis/redis-client.js'
import { sessionManager } from '~/src/server/common/helpers/session-manager.js'
import { sessionCookie } from '~/src/server/common/helpers/auth/session-cookie.js'
import { requestLogger } from '~/src/server/common/helpers/logging/request-logger.js'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context.js'
import { secureContext } from '~/src/server/common/helpers/secure-context/index.js'
import { sanitise } from '~/src/server/common/helpers/sanitisation/sanitise.js'
import { auditing } from '~/src/server/common/helpers/audit/audit.js'
import { pulse } from '~/src/server/common/helpers/pulse.js'
import { addDecorators } from '~/src/server/common/helpers/add-decorators.js'
import { s3Client } from '~/src/server/common/helpers/aws/s3-client.js'
import { contentSecurityPolicy } from '~/src/server/common/helpers/csp/content-security-policy.js'
import { requestTracing } from '~/src/server/common/helpers/request-tracing.js'
import { setupProxy } from '~/src/server/common/helpers/proxy/setup-proxy.js'
import { federatedOidc } from '~/src/server/common/helpers/auth/federated-oidc.js'
import { cognitoFederatedCredentials } from '~/src/server/common/helpers/auth/cognito.js'
import { setupCaches } from '~/src/server/common/helpers/setup-caches.js'

const enableSecureContext = config.get('enableSecureContext')
const redisClient = buildRedisClient(config.get('redis'))
const serverCache = [
  {
    name: 'session',
    engine: new CatboxRedis({ client: redisClient })
  },
  {
    name: 'featureToggles',
    engine: new CatboxRedis({ client: redisClient })
  }
]

/**
 * @typedef {object} Options
 * @property {import('@hapi/hapi').ServerCache} cache
 * @param {Options} options
 * @returns {Promise<import('@hapi/hapi').Server>}
 */
async function createServer({ cache } = { cache: serverCache }) {
  setupProxy()

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
    cache,
    state: {
      strictHeader: false
    }
  })

  setupCaches(server)
  addDecorators(server)

  // Add tracer and request logger before all other plugins
  await server.register([requestTracing, requestLogger])

  if (enableSecureContext) {
    await server.register(secureContext)
  }

  const authPlugins = config.get('azureFederatedCredentials.enabled')
    ? [cognitoFederatedCredentials, federatedOidc]
    : [azureOidc]

  await server.register([
    pulse,
    sessionManager,
    ...authPlugins,
    sessionCookie,
    Scooter,
    contentSecurityPolicy,
    csrf,
    nunjucksConfig,
    sanitise,
    router,
    auditing,
    s3Client
  ])

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })
  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
