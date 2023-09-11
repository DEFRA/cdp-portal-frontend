import path from 'path'
import hapi from '@hapi/hapi'
import bell from '@hapi/bell'
import jwt from '@hapi/jwt'
import qs from 'qs'

import { router } from './router'
import { appConfig } from '~/src/config'
import { nunjucksConfig } from '~/src/config/nunjucks'
import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { catchAll } from '~/src/server/common/helpers/errors'
import { flashMessage } from '~/src/server/common/helpers/flash-message'
import { requestLogger } from '~/src/server/common/helpers/request-logger'
import { addFlashMessagesToContext } from '~/src/server/common/helpers/add-flash-messages-to-context'

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
    }
  })

  await server.register(bell)

  server.auth.strategy('azure-oidc', 'bell', {
    provider: {
      name: 'azure-oidc',
      protocol: 'oauth2',
      useParamsAuth: true,
      auth: `https://login.microsoftonline.com/${appConfig.get(
        'azureTenantId'
      )}/oauth2/v2.0/authorize`,
      token: `https://login.microsoftonline.com/${appConfig.get(
        'azureTenantId'
      )}/oauth2/v2.0/token`,
      scope: [
        `api://${appConfig.get('azureClientId')}/cdp.user`,
        'openid',
        'profile',
        'email',
        'offline_access',
        'user.read'
      ],
      profile: async function (credentials, params, get) {
        const payload = jwt.token.decode(credentials.token).decoded.payload
        credentials.profile = {
          id: payload.oid,
          displayName: payload.name,
          email: payload.upn ?? payload.preferred_username,
          groups: payload.groups
        }
      }
    },
    password: appConfig.get('sessionCookiePassword'),
    clientId: appConfig.get('azureClientId'),
    clientSecret: appConfig.get('azureClientSecret'),
    cookie: 'bell-azure-oidc',
    isSecure: !appConfig.get('isDevelopment'),
    config: {
      tenant: appConfig.get('azureTenantId')
    }
  })

  server.ext('onPreResponse', addFlashMessagesToContext, {
    before: ['yar']
  })

  await server.register(flashMessage)

  await server.register(requestLogger)

  await server.register(router, {
    routes: { prefix: appConfig.get('appPathPrefix') }
  })

  await server.register(nunjucksConfig)

  server.decorate('request', 'isXhr', isXhr)

  server.ext('onPreResponse', catchAll)

  return server
}

export { createServer }
