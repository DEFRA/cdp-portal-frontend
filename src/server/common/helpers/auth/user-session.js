import { sessionNames } from '~/src/server/common/constants/session-names'
import { addSeconds } from 'date-fns'

function removeUserSession(request) {
  request.yar.clear(sessionNames.user)
  request.cookieAuth.clear()
}

function updateUserSession(request, session) {
  // Update cookie with new expiry date
  request.state['session-cookie'].expires = addSeconds(
    new Date(),
    session.expires_in
  )

  // Update tokens in session
  const userSession = request.yar.get(sessionNames.user)
  request.yar.set(sessionNames.user, {
    ...userSession,
    token: session.access_token,
    refreshToken: session.refresh_token
  })
}

export { removeUserSession, updateUserSession }
