import authCookie from '@hapi/cookie'
import { isPast, parseISO, subMinutes } from 'date-fns'

import { config } from '~/src/config/index.js'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token.js'
import {
  removeAuthenticatedUser,
  updateUserSession
} from '~/src/server/common/helpers/auth/user-session.js'

const sessionCookie = {
  plugin: {
    name: 'user-session',
    register: async (server) => {
      await server.register(authCookie)

      server.auth.strategy('session', 'cookie', {
        cookie: {
          name: 'userSession',
          path: '/',
          password: config.get('sessionCookiePassword'),
          isSecure: config.get('isProduction'),
          ttl: config.get('sessionCookieTtl'),
          clearInvalid: true
        },
        keepAlive: true,
        requestDecoratorName: 'sessionCookie',
        validate: async (request, session) => {
          const authedUser = await request.getUserSession()

          const tokenHasExpired =
            Boolean(authedUser?.expiresAt) &&
            isPast(subMinutes(parseISO(authedUser?.expiresAt), 1))

          if (tokenHasExpired) {
            const response = await refreshAccessToken(request)

            if (!response?.ok) {
              removeAuthenticatedUser(request)

              return { isValid: false }
            }

            const refreshAccessTokenJson = await response.json()
            const updatedSession = await updateUserSession(
              request,
              refreshAccessTokenJson
            )

            return {
              isValid: true,
              credentials: updatedSession
            }
          }

          const userSession = await server.app.cache.get(session.sessionId)

          if (userSession) {
            return {
              isValid: true,
              credentials: userSession
            }
          }

          return { isValid: false }
        }
      })

      server.auth.default('session')
    }
  }
}

export { sessionCookie }
