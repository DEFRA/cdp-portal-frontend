import jwt from '@hapi/jwt'

import { appConfig } from '~/src/config'

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: (server) => {
      server.auth.strategy('azure-oidc', 'bell', {
        location: appConfig.get('appRedirectUrl'),
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
        isSecure: false,
        config: {
          tenant: appConfig.get('azureTenantId')
        }
      })
    }
  }
}

export { azureOidc }
