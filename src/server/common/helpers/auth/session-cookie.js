import authCookie from '@hapi/cookie'
import { config } from '#config/config.js'
import { fetchScopes } from '../../../teams/helpers/fetch/fetch-scopes.js'
import { saveUserSession } from '#server/common/helpers/auth/save-session.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { removeAuthenticatedUser } from '#server/common/helpers/auth/remove-authenticated-user.js'
import {
  dropSession,
  getSession
} from '#server/common/helpers/auth/session-cache.js'

const sessionCookieConfig = config.get('session.cookie')

export const sessionCookie = {
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
          const sessionId = session.sessionId
          if (!session?.sessionId) {
            return { isValid: false }
          }
          const currentUserSession = await getSession(sessionId, server)
          if (!currentUserSession?.isAuthenticated) {
            return { isValid: false }
          }

          let refreshedSession
          try {
            const refreshTokenResponse =
              await request.validateAndRefreshToken(currentUserSession)
            if (refreshTokenResponse) {
              request.logger.info(`Refreshing session: ${sessionId}`)
              refreshedSession = await saveUserSession(
                request,
                sessionId,
                refreshTokenResponse
              )
            }
          } catch (error) {
            request.logger.debug(
              error,
              `Token refresh for ${currentUserSession?.displayName} failed`
            )
            dropSession(sessionId, server)

            removeAuthenticatedUser(request)
            request.yar.flash(
              sessionNames.globalValidationFailures,
              'Your login expired'
            )
          }

          const userSession = !refreshedSession
            ? currentUserSession
            : refreshedSession

          const { scopes, scopeFlags } = await fetchScopes(userSession.token)
          return {
            isValid: true,
            credentials: {
              ...userSession,
              ...(scopeFlags ?? {}),
              scope: scopes ?? []
            }
          }
        }
      })
      server.auth.default('session')
    }
  }
}
