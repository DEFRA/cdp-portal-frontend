import * as openid from 'openid-client'
import Jwt from '@hapi/jwt'
import assert from 'assert'

/**
 * Validates an access token and refreshes it if it is about to expire.
 * Always returns a normalized token object.
 *
 * @param {Object} params
 * @param {string} params.refreshToken - JWT refresh token.
 * @param {string} params.accessToken - JWT access token.
 * @param {Function} getOidcConfig - Async function that returns the OIDC client configuration.
 * @param {number} [earlyRefreshMs=60000] - Time in ms before expiry to refresh early.
 * @param {string} [scope] - Optional scope for refresh.
 * @param {Object} [logger] - Optional logger.
 * @returns {Promise<{accessToken: string, refreshToken: string, idToken?: string, claims?: Object, expiresIn?: number}>} Token object.
 */
export async function validateAndRefreshToken(
  { refreshToken: jwtRefreshToken, accessToken },
  getOidcConfig,
  earlyRefreshMs = 60_000,
  scope,
  logger
) {
  const decoded = Jwt.token.decode(accessToken)
  try {
    Jwt.token.verifyTime(decoded, { now: Date.now() + earlyRefreshMs })
  } catch {
    logger?.info?.(
      `Token for user ${decoded?.name} expiring, attempting to refresh`
    )
    try {
      return await refreshToken(jwtRefreshToken, getOidcConfig, scope, logger)
    } catch (e) {
      logger?.warn?.(e, e.message)
      throw e
    }
  }
}

/**
 * Performs a refresh token grant and returns a normalized token object.
 *
 * @param {string} jwtRefreshToken - JWT refresh token.
 * @param {Function} getOidcConfig - Async function returning the OIDC client configuration.
 * @param {string} [scope] - Optional scope for refresh.
 * @param {Object} [logger] - Optional logger.
 * @returns {Promise<{accessToken: string, refreshToken: string, idToken?: string, claims?: Object, expiresIn?: number}>} Normalized token object.
 * @throws {Error} If refresh token is missing or refresh grant fails.
 */
export async function refreshToken(
  jwtRefreshToken,
  getOidcConfig,
  scope,
  logger
) {
  assert(jwtRefreshToken, 'Missing refresh token')
  const oidcConfig = await getOidcConfig(logger)
  const token = await openid.refreshTokenGrant(oidcConfig, jwtRefreshToken, {
    scope
  })

  const {
    access_token: accessToken,
    refresh_token: refreshToken,
    id_token: idToken
  } = token
  const claims = token.claims?.()
  const expiresIn = token.expiresIn?.()

  return { accessToken, refreshToken, idToken, claims, expiresIn }
}
