import jwt from '@hapi/jwt'
import {
  CognitoIdentityClient,
  GetOpenIdTokenForDeveloperIdentityCommand
} from '@aws-sdk/client-cognito-identity'

/**
 * Provides a federated Cognito token for a given identity pool.
 *
 * Automatically caches the token and refreshes it when it expires.
 * Supports an optional early refresh window to refresh slightly before actual expiry.
 */
export class CognitoTokenProvider {
  #token = null

  /**
   * Creates a new CognitoTokenProvider instance.
   *
   * @param {Object} params
   * @param {string} params.poolId - The Cognito Identity Pool ID.
   * @param {Object<string,string>} [params.logins={}] - Optional logins map (developer provider names to user IDs).
   * @param {CognitoIdentityClient} [params.cognitoClient] - Optional AWS CognitoIdentityClient instance.
   * @throws {Error} If poolId is not provided.
   */
  constructor({
    poolId,
    logins = {},
    cognitoClient = new CognitoIdentityClient(),
    earlyRefreshMs = 0
  }) {
    if (!poolId) throw new Error('poolId is required')
    this.poolId = poolId
    this.logins = logins
    this.cognitoClient = cognitoClient
    this.type = 'federated'
    this.earlyRefreshMs = earlyRefreshMs
  }

  /**
   * Requests a new Cognito token from the identity pool.
   *
   * @private
   * @param {Object} [logger] - Optional logger to log token issuance.
   * @returns {Promise<string>} The issued JWT token from Cognito.
   */
  async #request(logger) {
    const input = { IdentityPoolId: this.poolId, Logins: this.logins }
    const command = new GetOpenIdTokenForDeveloperIdentityCommand(input)
    const result = await this.cognitoClient.send(command)
    logger?.info?.(`Result: ${result}`)
    logger?.info?.(`Cognito token issued identityId: ${result?.IdentityId}`)
    return result.Token
  }

  /**
   * Returns a valid Cognito token, refreshing it if necessary.
   * If the cached token is expired or within the early refresh window, a new token is requested.
   *
   * @param {Object} [logger] - Optional logger.
   * @returns {Promise<string>} A valid JWT token.
   */
  async getCredentials(logger) {
    if (
      !this.#token ||
      this.#tokenHasExpired(this.#token, this.earlyRefreshMs, logger)
    ) {
      logger?.info?.('Refreshing Cognito token')
      this.#token = await this.#request(logger)
    }
    return this.#token
  }

  /**
   * Checks if a JWT token has expired or is within the early refresh window.
   *
   * @private
   * @param {string} token - The JWT token to check.
   * @param {number} earlyRefreshMs - Time in milliseconds before actual expiry to consider the token expired.
   * @returns {boolean} True if token has expired or is invalid, false otherwise.
   */
  #tokenHasExpired(token, earlyRefreshMs, logger) {
    try {
      const decoded = jwt.token.decode(token)
      logger?.info?.(
        `now: ${Date.now() + earlyRefreshMs} decoded token : ${decoded}`
      )
      jwt.token.verifyTime(decoded, { now: Date.now() + earlyRefreshMs })
      return false
    } catch (e) {
      logger?.info?.(`error is: ${e}`)
      return true
    }
  }
}
