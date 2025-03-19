import {
  CognitoIdentityClient,
  GetOpenIdTokenForDeveloperIdentityCommand
} from '@aws-sdk/client-cognito-identity'
import { ClientAssertionCredential } from '@azure/identity'
import { add } from 'date-fns'
import { config } from '~/src/config/config.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const azureTokenLifespanMinutes = 10

const logger = createLogger()
const client = new CognitoIdentityClient()

/**
 * Attempts to get a federated token from cognito
 * @returns {Promise<string>}
 */
async function getCognitoToken() {
  // Don't pull service name from config as PFE store it as a human-readable version.
  const serviceName = 'cdp-portal-frontend'
  const poolId = config.get('azureFederatedCredentials.identityPoolId')
  if (poolId == null) {
    throw new Error('AZURE_IDENTITY_POOL_ID is not set')
  }

  const logins = {}
  logins[`${serviceName}-aad-access`] = serviceName

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
    logger.error(e)
    throw e
  }
}

async function federatedCredentials() {
  const azureClientId = config.get('azureClientId')
  const azureTenantId = config.get('azureTenantId')

  logger.info('Using federated credentials')
  const credential = new ClientAssertionCredential(
    azureTenantId,
    azureClientId,
    getCognitoToken
  )
  return await credential.getToken()
}

export async function refreshFederatedCredentials() {
  if (!config.get('azureFederatedCredentials.enabled')) {
    logger.debug('Federated credentials not enabled')
    return
  }

  if (expiresAt.getTime() < new Date().getTime()) {
    token = await federatedCredentials()
    expiresAt = add(new Date(), { minutes: azureTokenLifespanMinutes })
    logger.info('Refreshed federated credentials')
  } else {
    logger.info(
      `Refreshed federated are valid until ${expiresAt.toISOString()}`
    )
  }
}

let token = ''
let expiresAt = new Date()

export function getAzureCredentialsToken() {
  if (config.get('azureFederatedCredentials.enabled')) {
    return token
  } else {
    return config.get('azureClientSecret')
  }
}
