import {
  refreshUserSession,
  removeAuthenticatedUser
} from '~/src/server/common/helpers/auth/user-session.js'
import { isPast, parseISO } from 'date-fns'
import { sessionNames } from '~/src/server/common/constants/session-names.js'

/**
 * To be used as a server ext method to check if a token has expired and attempt to use the refresh token to get a
 * new one.
 * Requires a refreshToken function as the first param to provide a new token.
 * @param {Function} refreshToken
 * @param {{}} request
 * @param {{}} h
 * @returns {Promise<*>}
 */
export async function refreshTokenIfExpired(refreshToken, request, h) {
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
      const refreshTokenResponse = await refreshToken(userSession?.refreshToken)
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
