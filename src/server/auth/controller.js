import { randomUUID } from 'node:crypto'

import Boom from '@hapi/boom'

import {
  createUserSession,
  refreshUserSession
} from '~/src/server/common/helpers/auth/user-session.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { userLog } from '~/src/server/common/helpers/logging/user-log.js'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token.js'

const authCallbackController = {
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => Boom.boomify(Boom.unauthorized())
    }
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const sessionId = randomUUID()

      await createUserSession(request, sessionId)

      request.sessionCookie.set({ sessionId })

      const { profile } = request.auth.credentials

      request.logger.info(
        userLog(
          'User logged in',
          { id: profile?.id, displayName: profile?.displayName },
          profile?.scopeFlags,
          profile?.scopes
        )
      )
      request.audit.sendMessage({
        event: `User logged in ${profile?.id} ${profile?.displayName}`,
        user: profile
      })
    }

    const redirect = request.yar.flash(sessionNames.referrer)?.at(0) ?? '/'

    // Borrowed from hapi/bell
    // Workaround for some browsers where due to CORS and the redirection method, the state
    // cookie is not included with the request unless the request comes directly from the same origin.
    return h
      .response(
        `<html><head><meta http-equiv="refresh" content="0;URL='${redirect}'"></head><body></body></html>`
      )
      .takeover()
  }
}

/**
 * This endpoint is for debugging/testing the refresh token flow.
 * Likely to be removed, don't build anything on top of it!
 */
const refreshTokenController = {
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      // refreshing access token with refresh token
      try {
        const sessionBeforeRefresh = await request.getUserSession()
        const { payload } = await refreshAccessToken(request)
        const sessionAfterRefresh = await refreshUserSession(request, payload)
        return h.response(
          JSON.stringify({
            before: { expiresAt: sessionBeforeRefresh.expiresAt },
            after: { expiresAt: sessionAfterRefresh.expiresAt }
          })
        )
      } catch (error) {
        request.logger.error(error, 'Token refresh failed')
        return h.response(error.message)
      }
    }
    return h.response('Not logged in, cant refresh token')
  }
}

export { authCallbackController, refreshTokenController }
