import authCookie from '@hapi/cookie'
import { isPast, parseISO, subMinutes } from 'date-fns'

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
            isPast(subMinutes(parseISO(userSession?.expiresAt), 1))

          if (tokenHasExpired) {
            const refreshTokenResponse = await refreshAccessToken(request)

            if (!refreshTokenResponse?.ok) {
              removeAuthenticatedUser(request)

              return { isValid: false }
            }

            const updatedSession = await refreshUserSession(
              request,
              await refreshTokenResponse.json()
            )

            return {
              isValid: true,
              credentials: updatedSession
            }
          } else if (userSession?.isAuthenticated) {
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
