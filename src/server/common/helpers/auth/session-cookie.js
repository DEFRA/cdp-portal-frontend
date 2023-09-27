import authCookie from '@hapi/cookie'
import { addSeconds, isPast, parseISO } from 'date-fns'

import { appConfig } from '~/src/config'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token'
import { sessionNames } from '~/src/server/common/constants/session-names'

const sessionCookie = {
  plugin: {
    name: 'session-cookie',
    register: async (server) => {
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
          const tokenHasExpired = isPast(parseISO(session.expires))

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
