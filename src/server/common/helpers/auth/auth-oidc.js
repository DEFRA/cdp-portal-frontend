import { config } from '../../../../config/config.js'
import {
  createCognitoFederatedOidcConfig,
  createMockOidcConfig,
  HapiAuthOidcPlugin
} from '../hapi-auth-oidc/index.js'

const clientId = config.get('azureClientId')
const discoveryUri = config.get('oidcWellKnownConfigurationUrl')
const getOidcConfig = config.get('isProduction')
  ? createCognitoFederatedOidcConfig({
      discoveryUri,
      clientId,
      poolId: config.get('azureFederatedCredentials.identityPoolId'),
      logins: { 'cdp-portal-frontend-aad-access': 'cdp-portal-frontend' }
    })
  : createMockOidcConfig({
      discoveryUri,
      clientId
    })

const sessionCookieConfig = config.get('session.cookie')

export const AuthOidcPlugin = {
  plugin: HapiAuthOidcPlugin,
  options: {
    strategyName: 'azure-oidc',
    oidc: {
      getOidcConfig,
      loginCallbackUri: config.get('appBaseUrl') + '/auth/callback',
      scope: `api://${config.get('azureClientId')}/cdp.user openid profile email offline_access user.read`,
      externalBaseUrl: 'http://localhost:3000'
    },
    cookieOptions: {
      isSecure: sessionCookieConfig.isSecure,
      password: sessionCookieConfig.password
    }
  }
}
