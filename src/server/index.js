import qs from 'qs'
import path from 'node:path'
import hapi from '@hapi/hapi'
import Scooter from '@hapi/scooter'

import { router } from './router.js'
import { config } from '../config/config.js'
import { nunjucksConfig } from '../config/nunjucks/index.js'
import { csrf } from './common/helpers/auth/csrf.js'
import { catchAll } from './common/helpers/errors/catch-all.js'
import { azureOidc } from './common/helpers/auth/azure-oidc.js'
import { sessionManager } from './common/helpers/session/session-manager.js'
import { sessionCookie } from './common/helpers/auth/session-cookie.js'
import { requestLogger } from './common/helpers/logging/request-logger.js'
import { addFlashMessagesToContext } from './common/helpers/add-flash-messages-to-context.js'
import { secureContext } from './common/helpers/secure-context/index.js'
import { sanitise } from './common/helpers/sanitisation/sanitise.js'
import { auditing } from './common/helpers/audit/auditing.js'
import { pulse } from './common/helpers/pulse.js'
import { addDecorators } from './common/helpers/add-decorators.js'
import { s3Client } from './common/helpers/aws/s3-client.js'
import { contentSecurityPolicy } from './common/helpers/csp/content-security-policy.js'
import { requestTracing } from './common/helpers/request-tracing.js'
import { setupProxy } from './common/helpers/proxy/setup-proxy.js'
import { federatedOidc } from './common/helpers/auth/federated-oidc.js'
import { cognitoFederatedCredentials } from './common/helpers/auth/cognito.js'
import { setupCaches } from './common/helpers/session/setup-caches.js'
import { getCacheEngine } from './common/helpers/session/cache-engine.js'

const enableSecureContext = config.get('enableSecureContext')

/**
 * @typedef {object} Options
 * @property {import('@hapi/hapi').ServerCache} cache
 * @returns {Promise<import('@hapi/hapi').Server>}
 */
async function createServer() {
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
    cache: {
      name: config.get('session.cache.name'),
      engine: getCacheEngine(
        /** @type {Engine} */ (config.get('session.cache.engine'))
      )
    },
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

  const sessionCookieConfig = config.get('session.cookie')
  const oneSecond = 1000

  server.state('flash', {
    ttl: oneSecond,
    isSecure: sessionCookieConfig.isSecure,
    isHttpOnly: true,
    encoding: 'iron',
    password: sessionCookieConfig.password,
    clearInvalid: true,
    strictHeader: true
  })

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })
  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
