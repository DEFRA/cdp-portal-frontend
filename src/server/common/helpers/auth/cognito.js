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
  const options = {}

  const proxy = config.get('httpProxy')
  if (proxy != null) {
    const proxyUrl = new URL(proxy)
    logger.info(
      `ClientAssertionCredential proxy set to use ${proxyUrl.href}:${proxyUrl.port}`
    )
    options.proxyOptions = {
      host: proxyUrl.href,
      port: proxyUrl.port
    }
  }

  logger.info('Creating ClientAssertionCredential')
  const credential = new ClientAssertionCredential(
    azureTenantId,
    azureClientId,
    getCognitoToken,
    options
  )
  logger.info('Created ClientAssertionCredential')
  return await credential.getToken()
}

export async function refreshFederatedCredentials() {
  if (!config.get('azureFederatedCredentials.enabled')) {
    logger.debug('Federated credentials not enabled')
    return
  }

  if (expiresAt.getTime() < new Date().getTime()) {
    const federatedToken = await federatedCredentials()
    token = federatedToken.token
    expiresAt = add(new Date(), { minutes: azureTokenLifespanMinutes }) // TODO: use date from token
    logger.info(
      `Refreshed federated credentials ${federatedToken.tokenType} ${federatedToken.expiresOnTimestamp}`
    )
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
