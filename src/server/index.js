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
import { fetchWithAuth } from '~/src/server/common/helpers/auth/fetch-with-auth'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session'
import { requestLogger } from '~/src/server/common/helpers/logging/request-logger'
import { dropUserSession } from '~/src/server/common/helpers/auth/drop-user-session'
import { userHasTeamScopeDecorator } from '~/src/server/common/helpers/user/user-has-team-scope'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context'

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
          partition: config.get('redisKeyPrefix'),
          client
        })
      }
    ]
  })

  server.app.cache = server.cache({
    cache: 'session',
    segment: config.get('redisKeyPrefix'),
    expiresIn: config.get('redisTtl')
  })

  server.decorate('request', 'isXhr', isXhr)
  server.decorate('request', 'fetchWithAuth', fetchWithAuth, { apply: true })
  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)
  server.decorate('request', 'userHasTeamScope', userHasTeamScopeDecorator, {
    apply: true
  })

  await server.register([
    sessionManager,
    azureOidc,
    sessionCookie,
    csrf,
    requestLogger,
    nunjucksConfig,
    router
  ])

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })
  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
