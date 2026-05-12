import { dropSession } from '#server/common/helpers/auth/session-cache.js'

/**
 * Remove authenticated user from the portal
 * @param {import("@hapi/hapi").Request} request
 */
export function removeAuthenticatedUser(request) {
  dropSession(request.state?.userSessionCookie?.sessionId, request.server)
  if (request.sessionCookie?.h) {
    request.sessionCookie.clear()
    request.sessionCookie.h.unstate('csrfToken')
    request.sessionCookie.h.unstate('userSessionCookie')
    request.sessionCookie.h.unstate('cdpPortalSession')
  }
}
