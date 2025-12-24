import jwt from '@hapi/jwt'
import bell from '@hapi/bell'
import qs from 'qs'
import Wreck from '@hapi/wreck'

import { config } from '../../../../config/config.js'
import { sessionNames } from '../../constants/session-names.js'
import { fetchWellknown } from '../fetch/fetch-well-known.js'
import { refreshTokenIfExpired } from './refresh-token.js'

const sessionCookieConfig = config.get('session.cookie')

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(bell)
      const wellKnown = await fetchWellknown()
      const authCallbackUrl = config.get('appBaseUrl') + '/auth/callback'

      // making the OIDC config available to server
      server.app.oidc = wellKnown

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

          auth: wellKnown.authorization_endpoint,
          token: wellKnown.token_endpoint,
          scope: [
            `api://${config.get('azureClientId')}/cdp.user`,
            'openid',
            'profile',
            'email',
            'offline_access',
            'user.read'
          ],
          profile: async function (credentials, _params, get) {
            const decodedPayload = jwt.token.decode(credentials.token).decoded
              .payload
            const endpoint = config.get('userServiceBackendUrl') + '/scopes'

            const { scopes, scopeFlags } = await get(endpoint, {
              options: { agent: false }
            })

            credentials.profile = {
              id: decodedPayload.oid,
              displayName: decodedPayload.name,
              email: decodedPayload.upn ?? decodedPayload.preferred_username,
              scopes,
              scopeFlags,
              loginHint: decodedPayload.login_hint
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

      server.decorate('request', 'refreshToken', async function (userSession) {
        return refreshTokenIfExpired(
          (token) => refreshAccessToken(token, wellKnown),
          this,
          userSession
        )
      })
    }
  }
}

async function refreshAccessToken(refreshToken, oidcConfig) {
  const azureClientId = config.get('azureClientId')
  const azureClientSecret = config.get('azureClientSecret')
  const params = {
    client_id: azureClientId,
    client_secret: azureClientSecret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    scope: `api://${azureClientId}/cdp.user openid profile email offline_access user.read`
  }

  const response = await Wreck.post(oidcConfig.token_endpoint, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    payload: qs.stringify(params)
  })

  return JSON.parse(response.payload.toString())
}

export { azureOidc }
