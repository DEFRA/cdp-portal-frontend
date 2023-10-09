import { addSeconds } from 'date-fns'

function removeUserSession(request) {
  request.dropUserSession()
  request.cookieAuth.clear()
}

async function updateUserSession(request, refreshedSession) {
  // Update userSession with new access token and new expiry details
  const expiresInSeconds = refreshedSession.expires_in
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds)
  const authedUser = await request.getUserSession()

  await request.server.app.cache.set(request.state.userSession.sessionId, {
    ...authedUser,
    token: refreshedSession.access_token,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  })

  return await request.getUserSession()
}

export { removeUserSession, updateUserSession }
