import { randomUUID } from 'node:crypto'

import Boom from '@hapi/boom'

import {
  createUserSession,
  refreshUserSession
} from '~/src/server/common/helpers/auth/user-session.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { userLog } from '~/src/server/common/helpers/logging/user-log.js'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token.js'
import { redirectWithRefresh } from '~/src/server/common/helpers/url/url-helpers.js'

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

      request.logger.info('Creating user session')
      await createUserSession(request, sessionId)
      request.sessionCookie.set({ sessionId })
      request.logger.info('Setting session id')
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

    return redirectWithRefresh(h, redirect)
  }
}

/**
 * This endpoint is for debugging/testing the refresh token flow.
 */
const refreshTokenController = {
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      // refreshing access token with refresh token
      try {
        const sessionBeforeRefresh = await request.getUserSession()
        const refreshedToken = await refreshAccessToken(request)
        const sessionAfterRefresh = await refreshUserSession(
          request,
          refreshedToken
        )
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
