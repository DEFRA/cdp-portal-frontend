import jwt from '@hapi/jwt'
import { addSeconds } from 'date-fns'

import { config } from '~/src/config'

function removeUserSession(request) {
  request.dropUserSession()
  request.cookieAuth.clear()
}

async function updateUserSession(request, refreshedSession) {
  const refreshedPayload = jwt.token.decode(refreshedSession.access_token)
    .decoded.payload

  // Update userSession with new access token and new expiry details
  const expiresInSeconds = refreshedSession.expires_in
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)
  const isAdmin = refreshedPayload.groups.includes(
    config.get('azureAdminGroupId')
  )

  await request.server.app.cache.set(request.state.userSession.sessionId, {
    id: refreshedPayload.oid,
    email: refreshedPayload.preferred_username,
    displayName: refreshedPayload.name,
    loginHint: refreshedPayload.login_hint,
    isAuthenticated: true,
    token: refreshedSession.access_token,
    refreshToken: refreshedSession.refresh_token,
    isAdmin,
    scope: refreshedPayload.groups,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  })

  return await request.getUserSession()
}

export { removeUserSession, updateUserSession }
