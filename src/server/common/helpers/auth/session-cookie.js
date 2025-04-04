import authCookie from '@hapi/cookie'
import { isPast, parseISO } from 'date-fns'

import { config } from '~/src/config/config.js'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token.js'
import {
  removeAuthenticatedUser,
  refreshUserSession,
  updateUserScope
} from '~/src/server/common/helpers/auth/user-session.js'

const sessionCookieConfig = config.get('sessionCookie')

const sessionCookie = {
  plugin: {
    name: 'user-session',
    register: async (server) => {
      await server.register(authCookie)

      server.auth.strategy('session', 'cookie', {
        cookie: {
          name: 'userSessionCookie',
          path: '/',
          password: sessionCookieConfig.password,
          isSecure: sessionCookieConfig.isSecure,
          ttl: sessionCookieConfig.ttl,
          clearInvalid: true
        },
        keepAlive: true,
        requestDecoratorName: 'sessionCookie',
        validate: async (request) => {
          const userSession = await request.getUserSession()

          const tokenHasExpired =
            Boolean(userSession?.expiresAt) &&
            isPast(parseISO(userSession?.expiresAt))

          if (tokenHasExpired) {
            // refreshing access token with refresh token
            try {
              const refreshTokenResponse = await refreshAccessToken(request)
              const updatedSession = await refreshUserSession(
                request,
                refreshTokenResponse
              )

              return {
                isValid: true,
                credentials: updatedSession
              }
            } catch (error) {
              request.logger.debug(
                error,
                'Token refresh failed - sessionCookie'
              )
              removeAuthenticatedUser(request)

              return { isValid: false }
            }
          } else if (!tokenHasExpired && userSession?.isAuthenticated) {
            return {
              isValid: true,
              credentials: await updateUserScope(request, userSession)
            }
          } else {
            return { isValid: false }
          }
        }
      })

      server.auth.default('session')
    }
  }
}

export { sessionCookie }
