import {
  CognitoIdentityClient,
  GetOpenIdTokenForDeveloperIdentityCommand
} from '@aws-sdk/client-cognito-identity'
import { LogLevel, ConfidentialClientApplication } from '@azure/msal-node'
import { config } from '~/src/config/config.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { fetch } from 'undici'

const logger = createLogger()

let client = null

/**
 * Attempts to get a federated token from cognito
 * @returns {Promise<string>}
 */
async function getCognitoToken() {
  if (client == null) {
    const cognitoOptions = {}
    client = new CognitoIdentityClient(cognitoOptions)
  }

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
    logger.error('Failed to get Cognito Token', e)
    throw e
  }
}

async function exchangeToken(clientAssertion) {
  const azureClientId = '26372ac9-d8f0-4da9-a17e-938eb3161d8e' // config.get('azureClientId')
  const azureTenantId = config.get('azureTenantId')
  const aadAuthority = `https://login.microsoftonline.com/${azureTenantId}/`

  const msalApp = new ConfidentialClientApplication({
    auth: {
      clientId: azureClientId,
      authority: aadAuthority,
      clientAssertion
    },
    system: {
      loggerOptions: {
        loggerCallback: (_level, message, _containsPii) => {
          if (!_containsPii) logger.info(`MSAL Logging: ${message}`)
        },
        networkClient: {
          sendGetRequestAsync: async (url, options) => {
            return await fetch(url, options)
          },
          sendPostRequestAsync: async (url, options) => {
            return await fetch(url, options)
          }
        }
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose
    }
  })

  return await msalApp.acquireTokenByClientCredential({
    scopes: [`api://${config.get('azureClientId')}/.default`]
  })
}

export async function refreshFederatedCredentials() {
  if (!config.get('azureFederatedCredentials.enabled')) {
    logger.debug('Federated credentials not enabled')
    return
  }

  if (token == null || token.expiresOn.getTime() < new Date().getTime()) {
    logger.info('Token expired, getting token from cognito')
    const cognitoToken = await getCognitoToken()
    logger.info('Exchanging token via msal')
    const federatedToken = await exchangeToken(cognitoToken)
    logger.info(`Token exchange complete ID: ${federatedToken.correlationId}`)
    token = federatedToken
    logger.info(
      `Refreshed federated credentials, new expiration at: ${federatedToken.expiresOn?.toISOString()}`
    )
  } else {
    logger.info(
      `Refreshed federated are valid until ${token.expiresOn.toISOString()}`
    )
  }
}

let token = null

export function getAzureCredentialsToken() {
  if (config.get('azureFederatedCredentials.enabled')) {
    return token?.accessToken
  } else {
    return config.get('azureClientSecret')
  }
}
