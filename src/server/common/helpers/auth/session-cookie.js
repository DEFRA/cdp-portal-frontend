import authCookie from '@hapi/cookie'
import { config } from '../../../../config/config.js'
import { fetchScopes } from '../../../teams/helpers/fetch/fetch-scopes.js'
import { refreshUserSession, removeAuthenticatedUser } from './user-session.js'
import { sessionNames } from '../../constants/session-names.js'

const sessionCookieConfig = config.get('session.cookie')

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
        validate: async (request, session) => {
          const currentUserSession = await request.getUserSession(
            session.sessionId
          )

          if (currentUserSession?.isAuthenticated) {
            let refreshTokenResponse

            try {
              refreshTokenResponse =
                await request.validateAndRefreshToken(currentUserSession)
            } catch (error) {
              request.logger.debug(
                error,
                `Token refresh for ${currentUserSession?.displayName} failed`
              )
              removeAuthenticatedUser(request)
              request.yar.flash(
                sessionNames.globalValidationFailures,
                'Your login expired'
              )
            }

            const userSession = !refreshTokenResponse
              ? currentUserSession
              : await refreshUserSession(request, refreshTokenResponse)

            const { scopes, scopeFlags } = await fetchScopes(userSession.token)
            return {
              isValid: true,
              credentials: {
                ...userSession,
                ...(scopeFlags ?? {}),
                scope: scopes ?? []
              }
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
