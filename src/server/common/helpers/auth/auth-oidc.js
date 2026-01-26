import { config } from '../../../../config/config.js'
import {
  CognitoTokenProvider,
  HapiAuthOidcPlugin,
  MockProvider
} from '../hapi-auth-oidc/index.js'
import * as openid from 'openid-client'

const authProvider = config.get('isProduction')
  ? new CognitoTokenProvider({
      poolId: config.get('azureFederatedCredentials.identityPoolId'),
      logins: { 'cdp-portal-frontend-aad-access': 'cdp-portal-frontend' }
    })
  : new MockProvider()

const discoveryRequestOptions = config.get('isProduction')
  ? {}
  : { execute: [openid.allowInsecureRequests] }

const sessionCookieConfig = config.get('session.cookie')

export const AuthOidcPlugin = {
  plugin: HapiAuthOidcPlugin,
  options: {
    strategyName: 'azure-oidc',
    oidc: {
      clientId: config.get('azureClientId'),
      discoveryUri: config.get('oidcWellKnownConfigurationUrl'),
      authProvider,
      discoveryRequestOptions,
      loginCallbackUri: config.get('appBaseUrl') + '/auth/callback',
      scope: `api://${config.get('azureClientId')}/cdp.user openid profile email offline_access user.read`,
      externalBaseUrl: config.get('appBaseUrl')
    },
    cookieOptions: {
      isSecure: sessionCookieConfig.isSecure,
      password: sessionCookieConfig.password
    }
  }
}
