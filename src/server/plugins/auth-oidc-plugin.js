import { config } from '#config/config.js'
import {
  CognitoTokenProvider,
  hapiAuthOidcPlugin,
  MockProvider
} from '@defra/hapi-auth-oidc'

const oidcConfig = config.get('oidc')

const scope = [
  `api://${oidcConfig.clientId}/cdp.user`,
  'openid',
  'profile',
  'email',
  'offline_access',
  'user.read'
].join(' ')

const authProvider = config.get('federatedCredentials.enableMocking')
  ? new MockProvider({})
  : new CognitoTokenProvider({
      poolId: config.get('federatedCredentials.identityPoolId'),
      logins: { 'cdp-portal-frontend-aad-access': 'cdp-portal-frontend' }
    })

const oidcCookieConfig = config.get('session.cookie')

export const authOidcPlugin = {
  plugin: hapiAuthOidcPlugin,
  options: {
    strategyName: 'azure-oidc',
    oidc: {
      ...oidcConfig,
      scope,
      authProvider
    },
    cookieOptions: {
      // re-used from session cookie
      isSecure: oidcCookieConfig.secure,
      password: oidcCookieConfig.password
    }
  }
}
