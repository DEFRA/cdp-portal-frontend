import * as openid from 'openid-client'
import { CognitoTokenProvider } from '../providers/cognito.js'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { MockProvider } from '../providers/mock.js'
import assert from 'assert'

/**
 * Creates an OIDC configuration by discovering endpoints and setting up client authentication.
 * Supports 'client_secret' and 'federated' auth types.
 * @param {Object} params
 * @param {string} params.discoveryUri - The OIDC discovery URL.
 * @param {string} params.clientId - The client ID to use.
 * @param {Object} params.authProvider - An auth provider with type and getCredentials().
 * @param {Object} [params.discoveryRequestOptions={}] - Optional options for discovery request.
 * @param {Object} [params.logger] - Optional logger.
 * @returns {Promise<Object>} The discovered OIDC configuration.
 * @throws {Error} If authProvider type is unsupported.
 */
export async function createOidcConfig({
  discoveryUri,
  clientId,
  authProvider,
  discoveryRequestOptions = {},
  logger = undefined
}) {
  assert(
    authProvider.type === 'client_secret' || authProvider.type === 'federated',
    `Unsupported auth type: ${String(authProvider?.type)}`
  )

  const discoveryUrl = new URL(discoveryUri)
  const credential = await authProvider.getCredentials(logger)

  const metadata =
    authProvider.type === 'client_secret'
      ? {
          client_id: clientId,
          token_endpoint_auth_method: 'client_secret_post',
          client_secret: credential
        }
      : {}

  const clientAuthentication =
    authProvider.type === 'federated'
      ? async (_as, client, body) => {
          body.set('client_id', client.client_id)
          body.set(
            'client_assertion_type',
            'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
          )
          body.set('client_assertion', credential)
        }
      : undefined

  return openid.discovery(
    discoveryUrl,
    clientId,
    metadata,
    clientAuthentication,
    discoveryRequestOptions
  )
}

/**
 * Creates an OIDC configuration for AWS Cognito federated authentication.
 * @param {Object} params
 * @param {string} params.discoveryUri - The OIDC discovery URL.
 * @param {string} params.clientId - The client ID to use.
 * @param {string} params.poolId - Cognito Identity Pool ID.
 * @param {Object} params.logins - Cognito logins map.
 * @param {CognitoIdentityClient} [params.client] - Optional CognitoIdentityClient instance.
 * @returns {Function} A function that accepts a logger and returns a Promise resolving to the OIDC config.
 */
export function createCognitoFederatedOidcConfig({
  discoveryUri,
  clientId,
  poolId,
  logins,
  client: cognitoClient = new CognitoIdentityClient()
}) {
  return async (logger) =>
    await createOidcConfig({
      discoveryUri,
      clientId,
      authProvider: new CognitoTokenProvider({
        poolId,
        logins,
        client: cognitoClient
      }),
      logger
    })
}

/**
 * Creates a mock OIDC configuration for testing purposes.
 * @param {Object} params
 * @param {string} params.discoveryUri - The OIDC discovery URL.
 * @param {string} params.clientId - The client ID to use.
 * @param {string} [params.token] - Optional mock token; defaults to a random UUID.
 * @param {string} [params.type='federated'] - Auth type ('federated' or 'client_secret').
 * @returns {Function} A function that accepts a logger and returns a Promise resolving to the mock OIDC config.
 */

export function createMockOidcConfig({
  discoveryUri,
  clientId,
  token = crypto.randomUUID(),
  type = 'federated'
}) {
  return async (logger) =>
    await createOidcConfig({
      discoveryUri,
      clientId,
      authProvider: new MockProvider({ token, type }),
      discoveryRequestOptions: { execute: [openid.allowInsecureRequests] },
      logger
    })
}
