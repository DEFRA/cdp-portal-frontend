import qs from 'qs'
import path from 'path'
import hapi from '@hapi/hapi'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'

import { router } from './router'
import { config } from '~/src/config'
import { nunjucksConfig } from '~/src/config/nunjucks'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { csrf } from '~/src/server/common/helpers/auth/csrf'
import { catchAll } from '~/src/server/common/helpers/errors'
import { azureOidc } from '~/src/server/common/helpers/auth/azure-oidc'
import { buildRedisClient } from '~/src/server/common/helpers/redis-client'
import { sessionManager } from '~/src/server/common/helpers/session-manager'
import { sessionCookie } from '~/src/server/common/helpers/auth/session-cookie'
import { authedFetcher } from '~/src/server/common/helpers/fetch/authed-fetcher'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session'
import { requestLogger } from '~/src/server/common/helpers/logging/request-logger'
import { dropUserSession } from '~/src/server/common/helpers/auth/drop-user-session'
import { userIsTeamMemberDecorator } from '~/src/server/common/helpers/user/user-is-team-member'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context'
import { secureContext } from '~/src/server/common/helpers/secure-context'
import { userIsMemberOfATeamDecorator } from '~/src/server/common/helpers/user/user-is-member-of-a-team'
import { routeLookupDecorator } from '~/src/server/common/helpers/route-lookup'
import { sanitise } from '~/src/server/common/helpers/sanitisation/sanitise'
import { auditing } from '~/src/server/common/helpers/audit/auditor-plugin'

const client = buildRedisClient()
const isProduction = config.get('isProduction')

async function createServer() {
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
          client
        })
      }
    ]
  })

  // TODO refactor cache and decorate it on to server and request. No need for it to be on server.app
  server.app.cache = server.cache({
    cache: 'session',
    segment: config.get('serverCacheSegment'),
    expiresIn: config.get('redisTtl')
  })

  server.decorate('request', 'isXhr', isXhr)
  server.decorate('request', 'authedFetcher', authedFetcher, {
    apply: true
  })
  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)
  server.decorate('request', 'userIsTeamMember', userIsTeamMemberDecorator, {
    apply: true
  })
  server.decorate(
    'request',
    'userIsMemberOfATeam',
    userIsMemberOfATeamDecorator,
    {
      apply: true
    }
  )
  server.decorate('request', 'routeLookup', routeLookupDecorator, {
    apply: true
  })

  // Add request logger before all other plugins so we can see errors
  await server.register(requestLogger)

  if (isProduction) {
    await server.register(secureContext)
  }

  await server.register([
    sessionManager,
    azureOidc,
    sessionCookie,
    csrf,
    nunjucksConfig,
    sanitise,
    router
  ])

  await server.register({
    plugin: auditing,
    options: {
      source: 'cdp-portal-frontend'
    }
  })

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })
  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
