import { config } from '#config/config.js'
import {
  CognitoTokenProvider,
  hapiAuthOidcPlugin,
  MockProvider
} from '@defra/hapi-auth-oidc'

const { oidc, cookieOptions, federatedCredentials } = config.get('auth')

const scope = [
  `api://${oidc.clientId}/cdp.user`,
  'openid',
  'profile',
  'email',
  'offline_access',
  'user.read'
].join(' ')

const authProvider = federatedCredentials.enableMocking
  ? new MockProvider({})
  : new CognitoTokenProvider({
      poolId: federatedCredentials.identityPoolId,
      logins: { 'cdp-portal-frontend-aad-access': 'cdp-portal-frontend' }
    })

export const authOidcPlugin = {
  plugin: hapiAuthOidcPlugin,
  options: {
    oidc: {
      ...oidc,
      scope,
      authProvider
    },
    cookieOptions
  }
}
