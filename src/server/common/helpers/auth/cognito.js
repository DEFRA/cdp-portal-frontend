import jwt from '@hapi/jwt'
import * as Hoek from '@hapi/hoek'
import {
  CognitoIdentityClient,
  GetOpenIdTokenForDeveloperIdentityCommand
} from '@aws-sdk/client-cognito-identity'
import { config } from '~/src/config/config.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

/**
 * Cognito Client
 * @type {CognitoIdentityClient|null}
 */
let client = null

/**
 * Cognito federated credential token
 * @type {string|null}
 */
let token = null

/**
 * Attempts to get a federated token from cognito
 * @returns {Promise<string>}
 */
async function requestCognitoToken() {
  if (!client) {
    const cognitoOptions = {}
    client = new CognitoIdentityClient(cognitoOptions)
  }

  const poolId = config.get('azureFederatedCredentials.identityPoolId')
  Hoek.assert(poolId, 'AZURE_IDENTITY_POOL_ID is not set')

  const logins = {
    'cdp-portal-frontend-aad-access': 'cdp-portal-frontend'
  }

  const input = {
    IdentityPoolId: poolId,
    Logins: logins
  }

  try {
    const command = new GetOpenIdTokenForDeveloperIdentityCommand(input)
    const result = await client.send(command)
    logger.info(`Got token from Cognition ${result?.IdentityId}`)
    return result.Token
  } catch (e) {
    logger.error('Failed to get Cognito Token', e)
    throw e
  }
}

export function tokenHasExpired(tokenToCheck) {
  try {
    const decodedToken = jwt.token.decode(tokenToCheck)
    jwt.token.verifyTime(decodedToken)
  } catch (err) {
    logger.debug('Cognito token has expired', err)
    return true
  }
  return false
}

/**
 * Returns a federated credential token for use with AAD.
 * If the token is not set or has expired it requests a new one.
 * @returns {Promise<string>}
 */
export async function getAADCredentials() {
  if (!token || tokenHasExpired(token)) {
    logger.info('Refreshing cognito token')
    token = await requestCognitoToken()
  }
  return token
}
