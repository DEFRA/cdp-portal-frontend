import authCookie from '@hapi/cookie'
import { isPast, parseISO, subMinutes } from 'date-fns'

import { appConfig } from '~/src/config'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token'
import {
  removeUserSession,
  updateUserSession
} from '~/src/server/common/helpers/auth/user-session'

const sessionCookie = {
  plugin: {
    name: 'session-cookie',
    register: async (server, options) => {
      await server.register(authCookie)

      server.auth.strategy('session-cookie', 'cookie', {
        cookie: {
          name: 'session-cookie',
          path: '/',
          password: appConfig.get('sessionCookiePassword'),
          isSecure: appConfig.get('isProduction'),
          ttl: appConfig.get('sessionCookieTtl')
        },
        keepAlive: true,
        validate: async (request, session) => {
          const tokenHasExpired = isPast(
            subMinutes(parseISO(session.expires), 1)
          )

          if (tokenHasExpired) {
            const response = await refreshAccessToken(request)
            const updatedSession = await response.json()

            if (!response.ok) {
              // Refresh token failure
              request.yar.clear(sessionNames.user)
              request.cookieAuth.clear()

              return { isValid: false }
            }

            // Update cookie with new expiry date
            request.state['session-cookie'].expires = addSeconds(
              new Date(),
              updatedSession.expires_in
            )

            // Update tokens in session
            const userSession = request.yar.get(sessionNames.user)
            request.yar.set(sessionNames.user, {
              ...userSession,
              token: updatedSession.access_token,
              refreshToken: updatedSession.refresh_token
            })

            return {
              isValid: true,
              credentials: session
            }
          }

          return {
            isValid: true,
            credentials: session
          }
        }
      })

      server.auth.default('session-cookie')
    }
  }
}

export { sessionCookie }
