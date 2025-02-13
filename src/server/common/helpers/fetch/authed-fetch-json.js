import Wreck from '@hapi/wreck'
import { getTraceId } from '@defra/hapi-tracing'

import { config } from '~/src/config/config.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { handleResponse } from '~/src/server/common/helpers/fetch/handle-response.js'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token.js'
import {
  removeAuthenticatedUser,
  refreshUserSession
} from '~/src/server/common/helpers/auth/user-session.js'

/**
 * Fetch JSON from a given URL with the provided token
 * @param {string} url
 * @param {string} token
 * @param {Wreck.options} options
 * @returns {Promise<{res: *, error}|{res: *, payload: *}>}
 */
async function authedFetchJson(url, token, options = {}) {
  const logger = createLogger()
  const tracingHeader = config.get('tracing.header')
  const traceId = getTraceId()

  logger.debug({ url }, 'Fetching authenticated data')

  const method = (options?.method || 'get').toLowerCase()

  const { res, payload } = await Wreck[method](url, {
    ...options,
    json: true,
    headers: {
      ...(options?.headers && options.headers),
      ...(traceId && { [tracingHeader]: traceId }),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  return handleResponse({ res, payload })
}

function authedFetchJsonDecorator(request) {
  return async (url, options = {}) => {
    const authedUser = await request.getUserSession()
    const token = authedUser?.token ?? null

    return authedFetchJson(url, token, options).then(
      async ({ res, payload }) => {
        if (res.statusCode === statusCodes.unauthorized) {
          // Initial request has received a 401 from a call to an API. Refresh token and replay initial request

          try {
            const { payload: refreshAccessTokenPayload } =
              await refreshAccessToken(request)
            request.logger.debug(
              { refreshAccessTokenPayload },
              'Token refresh succeeded'
            )

            await refreshUserSession(
              request,
              JSON.parse(refreshAccessTokenPayload.toString())
            )

            const authedUser = await request.getUserSession()
            const newToken = authedUser?.token ?? null

            // Replay initial request with new token
            return await authedFetchJson(url, newToken, options)
          } catch (error) {
            request.logger.debug(error, 'Token refresh failed')
            removeAuthenticatedUser(request)
          }
        }

        return handleResponse({ res, payload })
      }
    )
  }
}

export { authedFetchJsonDecorator, authedFetchJson }
