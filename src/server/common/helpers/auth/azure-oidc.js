import jwt from '@hapi/jwt'
import bell from '@hapi/bell'

import { config } from '~/src/config/config.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

const sessionCookieConfig = config.get('sessionCookie')

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(bell)

      const { payload } = await fetcher(
        config.get('oidcWellKnownConfigurationUrl')
      )

      const authCallbackUrl = config.get('appBaseUrl') + '/auth/callback'

      // making the OIDC config available to server
      server.app.oidc = payload

      server.auth.strategy('azure-oidc', 'bell', {
        location: (request) => {
          if (request.info.referrer) {
            request.yar.flash(sessionNames.referrer, request.info.referrer)
          }

          return authCallbackUrl
        },
        provider: {
          name: 'azure-oidc',
          protocol: 'oauth2',
          useParamsAuth: true,
          auth: payload.authorization_endpoint,
          token: payload.token_endpoint,
          scope: [
            `api://${config.get('azureClientId')}/cdp.user`,
            'openid',
            'profile',
            'email',
            'offline_access',
            'user.read'
          ],
          profile: async function (credentials, _params, get) {
            const payload = jwt.token.decode(credentials.token).decoded.payload
            const endpoint = config.get('userServiceBackendUrl') + '/scopes'

            const { scopes, scopeFlags } = await get(endpoint, {
              options: { agent: false }
            })

            credentials.profile = {
              id: payload.oid,
              displayName: payload.name,
              email: payload.upn ?? payload.preferred_username,
              scopes,
              scopeFlags,
              loginHint: payload.login_hint
            }
          }
        },
        clientId: config.get('azureClientId'),
        forceHttps: config.get('isProduction'),
        clientSecret: config.get('azureClientSecret'),
        cookie: 'bell-azure-oidc',
        password: sessionCookieConfig.password,
        isSecure: sessionCookieConfig.isSecure,
        ttl: sessionCookieConfig.ttl,
        config: {
          tenant: config.get('azureTenantId')
        }
      })
    }
  }
}

export { azureOidc }
