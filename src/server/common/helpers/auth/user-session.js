import jwt from '@hapi/jwt'
import { addSeconds } from 'date-fns'

import { fetchScopes } from '~/src/server/teams/helpers/fetch/index.js'

function removeAuthenticatedUser(request) {
  request.dropUserSession()
  request.sessionCookie.clear()
  request.sessionCookie.h
    .response()
    .unstate('csrfToken')
    .unstate('userSessionCookie')
    .unstate('cdpPortalSession')
}

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

async function updateUserSession(request, refreshedSession) {
  request.logger.debug('User session updating')

  const refreshedPayload = jwt.token.decode(refreshedSession.access_token)
    .decoded.payload

  // Update userSession with new access token and new expiry details
  const expiresInSeconds = refreshedSession.expires_in
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)

  const { scopes, scopeFlags } = await fetchScopes(
    refreshedSession.access_token
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

  request.logger.debug('User session updated')
  return await request.getUserSession()
}

export { createUserSession, updateUserSession, removeAuthenticatedUser }
