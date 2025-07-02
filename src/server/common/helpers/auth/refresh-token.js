import {
  refreshUserSession,
  removeAuthenticatedUser
} from '~/src/server/common/helpers/auth/user-session.js'
import { isPast, parseISO } from 'date-fns'
import { sessionNames } from '~/src/server/common/constants/session-names.js'

/**
 * Plugin to check if a user is logged in and if their token has expired.
 * If the token has expired then it will attempt to use the refresh-token
 * to get a new token.
 * @type {{plugin: {name: string, register: refreshToken.plugin.register}}}
 */
export const refreshToken = {
  plugin: {
    name: 'refresh-token',
    register: function (server) {
      server.ext('onPreAuth', refreshTokenIfExpired)
    }
  }
}

async function refreshTokenIfExpired(request, h) {
  const userSession = await request.getUserSession()

  if (!userSession?.expiresAt) {
    return h.continue
  }

  const tokenHasExpired =
    Boolean(userSession?.expiresAt) && isPast(parseISO(userSession?.expiresAt))

  if (tokenHasExpired) {
    request.logger.info(
      `Token for user ${userSession.displayName} has expired, attempting to refresh`
    )
    try {
      const refreshTokenResponse = await request.refreshToken(
        userSession?.refreshToken
      )
      await refreshUserSession(request, refreshTokenResponse)
      return h.continue
    } catch (error) {
      request.logger.debug(
        error,
        `Token refresh for ${userSession.displayName} failed`
      )
      removeAuthenticatedUser(request)
      request.yar.flash(
        sessionNames.globalValidationFailures,
        'Your login expired'
      )
      return h.continue
    }
  }
  return h.continue
}
