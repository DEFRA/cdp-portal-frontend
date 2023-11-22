import jwt from '@hapi/jwt'
import bell from '@hapi/bell'

import { config } from '~/src/config'

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(bell)

      const oidc = await fetch(
        config.get('oidcWellKnownConfigurationUrl')
      ).then((res) => res.json())

      const authCallbackUrl = config.get('appBaseUrl') + '/auth/callback'

      // making the OIDC config available to requests
      server.decorate('request', 'oidc', oidc)

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
          auth: oidc.authorization_endpoint,
          token: oidc.token_endpoint,
          scope: [
            `api://${config.get('azureClientId')}/cdp.user`,
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
        password: config.get('sessionCookiePassword'),
        clientId: config.get('azureClientId'),
        clientSecret: config.get('azureClientSecret'),
        cookie: 'bell-azure-oidc',
        isSecure: false,
        config: {
          tenant: config.get('azureTenantId')
        }
      })
    }
  }
}

export { azureOidc }
