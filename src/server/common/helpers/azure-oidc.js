import jwt from '@hapi/jwt'
import bell from '@hapi/bell'

import { appConfig } from '~/src/config'
import { buildAppBaseUrl } from '~/src/server/common/helpers/build-app-base-url'

const azureTenantId = appConfig.get('azureTenantId')
const oAuthTokenUrl = `https://login.microsoftonline.com/${azureTenantId}/oauth2/v2.0/token`
const oAuthAuthorizeUrl = `https://login.microsoftonline.com/${azureTenantId}/oauth2/v2.0/authorize`

const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(bell)

      server.auth.strategy('azure-oidc', 'bell', {
        location: buildAppBaseUrl(server),
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
