import jwt from '@hapi/jwt'
import { addSeconds } from 'date-fns'

import { fetchScopes } from '~/src/server/teams/helpers/fetch/fetch-scopes.js'

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
 * @param {import('@hapi/hapi').Request} request
 */
function removeAuthenticatedUser(request) {
  request.dropUserSession()
  request.sessionCookie.clear()
  request.sessionCookie.h
    .response()
    .unstate('csrfToken')
    .unstate('userSessionCookie')
    .unstate('cdpPortalSession')
}

/**
 * Create user session
 * @param {import('@hapi/hapi').Request} request
 * @param {string} sessionId
 * @returns {Promise<void>}
 */
async function createUserSession(request, sessionId) {
  const expiresInSeconds = request.auth.credentials.expiresIn
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)

  const { id, email, displayName, loginHint, scopes, scopeFlags } =
    request.auth.credentials.profile

  await request.server.app.cache.set(sessionId, {
    id,
    email,
    displayName,
    loginHint,
    isAuthenticated: request.auth.isAuthenticated,
    token: request.auth.credentials.token,
    refreshToken: request.auth.credentials.refreshToken,
    isAdmin: scopeFlags.isAdmin,
    isTenant: scopeFlags.isTenant,
    scope: scopes,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  })
}

/**
 * Update user scope
 * @param {import('@hapi/hapi').Request} request
 * @param {UserSession} userSession
 * @returns {Promise<UserSession> | UserSession}
 */
async function updateUserScope(request, userSession) {
  const { scopes, scopeFlags } = await fetchScopes(userSession.token)

  await request.server.app.cache.set(
    request.state.userSessionCookie.sessionId,
    {
      ...userSession,
      isAdmin: scopeFlags.isAdmin,
      isTenant: scopeFlags.isTenant,
      scope: scopes
    }
  )

  return await request.getUserSession()
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
 * @param {import('@hapi/hapi').Request} request
 * @param {RefreshTokenResponse} refreshTokenResponse
 * @returns {Promise<UserSession> | UserSession}
 */
async function refreshUserSession(request, refreshTokenResponse) {
  request.logger.debug('User session updating')

  /** @type {JwtPayload} */
  const payload = jwt.token.decode(refreshTokenResponse.access_token).decoded
    .payload

  // Update userSession with new access token and new expiry details
  const expiresInSeconds = refreshTokenResponse.expires_in
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)

  const { scopes, scopeFlags } = await fetchScopes(
    refreshTokenResponse.access_token
  )

  await request.server.app.cache.set(
    request.state.userSessionCookie.sessionId,
    {
      id: payload.oid,
      email: payload.preferred_username,
      displayName: payload.name,
      loginHint: payload.login_hint,
      isAuthenticated: true,
      token: refreshTokenResponse.access_token,
      refreshToken: refreshTokenResponse.refresh_token,
      isAdmin: scopeFlags.isAdmin,
      isTenant: scopeFlags.isTenant,
      scope: scopes,
      expiresIn: expiresInMilliSeconds,
      expiresAt
    }
  )

  request.logger.debug('User session refreshed')

  return await request.getUserSession()
}

export {
  createUserSession,
  refreshUserSession,
  removeAuthenticatedUser,
  updateUserScope
}
/**
 * @import {UserSession} from '~/src/server/common/helpers/auth/get-user-session.js'
 */
