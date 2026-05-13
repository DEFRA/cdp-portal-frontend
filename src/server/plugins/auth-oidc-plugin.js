import { config } from '#config/config.js'
import {
  CognitoTokenProvider,
  hapiAuthOidcPlugin,
  MockProvider
} from '@defra/hapi-auth-oidc'
import http from 'node:http'
import https from 'node:https'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'

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
      logins: { 'cdp-portal-frontend-aad-access': 'cdp-portal-frontend' },
      cognitoClient: new CognitoIdentityClient({
        // todo why isn't this happening automatically?
        requestHandler: new NodeHttpHandler({
          httpsAgent: https.globalAgent,
          httpAgent: http.globalAgent
        })
      })
    })

const oidcCookieConfig = config.get('session.cookie')

export const authOidcPlugin = {
  plugin: hapiAuthOidcPlugin,
  options: {
    strategyName: 'azure-oidc',
    oidc: {
      ...oidcConfig,
      scope,
      authProvider,
      responseMode: null
    },
    cookieOptions: {
      // re-used from session cookie
      isSecure: oidcCookieConfig.secure,
      password: oidcCookieConfig.password
    }
  }
}
