import jwt from '@hapi/jwt'
import { addSeconds } from 'date-fns'

/**
 * @description MicroSoft refresh token response
 * @typedef {object} RefreshTokenResponse
 * @property {string} token_type
 * @property {string} scope
 * @property {number} expires_in
 * @property {string} ext_expires_in
 * @property {string} access_token
 * @property {string} refresh_token
 * @property {string} id_token
 */

/**
 * Remove authenticated user from the portal
 * @param {import("@hapi/hapi").Request} request
 */
function removeAuthenticatedUser(request) {
  request.dropUserSession()
  if (request.sessionCookie?.h) {
    request.sessionCookie.clear()
    request.sessionCookie.h.unstate('csrfToken')
    request.sessionCookie.h.unstate('userSessionCookie')
    request.sessionCookie.h.unstate('cdpPortalSession')
  }
}

/**
 * Create user session
 * @param {import("@hapi/hapi").Request} request
 * @param {string} sessionId
 * @returns {Promise<UserSession>}
 */
async function createUserSession(request, sessionId) {
  const expiresInSeconds = request.auth.credentials.expiresIn
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds).toISOString()

  const claims = request.auth.credentials.claims

  const session = {
    id: claims.sub || claims.oid,
    displayName: claims.name,
    email: claims.email ?? claims.preferred_username,
    loginHint: claims.login_hint,
    isAuthenticated: request.auth.isAuthenticated,
    token:
      request.auth.credentials.accessToken ?? request.auth.credentials.token,
    accessToken:
      request.auth.credentials.accessToken ?? request.auth.credentials.token,
    refreshToken: request.auth.credentials.refreshToken,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  }

  await request.server.session.set(sessionId, session)
  return session
}

/**
 * @typedef {object} JwtPayload
 * @property {string} oid
 * @property {string} preferred_username
 * @property {string} name
 * @property {string} login_hint
 */

/**
 * Refresh user session
 * @param {import("@hapi/hapi").Request} request
 * @param {RefreshTokenResponse} refreshTokenResponse
 * @returns {Promise<void | UserSession>}
 */
async function refreshUserSession(request, refreshTokenResponse) {
  request.logger.debug('User session refreshing')

  const { accessToken, refreshToken, expiresIn } = refreshTokenResponse

  /** @type {JwtPayload} */
  const payload = jwt.token.decode(accessToken).decoded.payload

  // Update userSession with new access token and new expiry details
  const expiresInSeconds = expiresIn
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds).toISOString()

  request.logger.info(
    `User session refreshed, UserId: ${payload.oid}, displayName: ${payload.name}`
  )

  const session = {
    id: payload.sub ?? payload.oid,
    email: payload.email ?? payload.preferred_username,
    displayName: payload.name,
    loginHint: payload.login_hint,
    isAuthenticated: true,
    token: accessToken,
    accessToken,
    refreshToken,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  }
  await request.server.session.set(
    request.state.userSessionCookie.sessionId,
    session
  )

  return session
}

export { createUserSession, refreshUserSession, removeAuthenticatedUser }
/**
 * @import {UserSession} from './get-user-session.js'
 */
