import jwt from '@hapi/jwt'
import bell from '@hapi/bell'

import { appConfig } from '~/src/config'

const azureTenantId = appConfig.get('azureTenantId')
const oAuthTokenUrl = `https://login.microsoftonline.com/${azureTenantId}/oauth2/v2.0/token`
const oAuthAuthorizeUrl = `https://login.microsoftonline.com/${azureTenantId}/oauth2/v2.0/authorize`
const authCallbackUrl =
  appConfig.get('appBaseUrl') +
  appConfig.get('appPathPrefix') +
  '/auth/callback'

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(bell)

      server.auth.strategy('azure-oidc', 'bell', {
        location: (request) => {
          if (request.info.referrer) {
            request.yar.flash('referrer', request.info.referrer)
          }

          return authCallbackUrl
        },
        provider: {
          name: 'azure-oidc',
          protocol: 'oauth2',
          useParamsAuth: true,
          auth: oAuthAuthorizeUrl,
          token: oAuthTokenUrl,
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
              groups: payload.groups,
              loginHint: payload.login_hint
            }
          }
        },
        password: appConfig.get('sessionCookiePassword'),
        clientId: appConfig.get('azureClientId'),
        clientSecret: appConfig.get('azureClientSecret'),
        cookie: 'bell-azure-oidc',
        isSecure: false,
        config: {
          tenant: azureTenantId
        }
      })
    }
  }
}

export { azureOidc }
