import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token.js'
import { handleResponse } from '~/src/server/common/helpers/fetch/handle-response.js'
import { getTraceId } from '@defra/hapi-tracing'
import {
  removeAuthenticatedUser,
  refreshUserSession
} from '~/src/server/common/helpers/auth/user-session.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

/**
 * @param {string} url
 * @param {string} token
 * @param {RequestOptions} options
 * @returns {Promise<Response>}
 */
function authedFetcher(url, token, options = {}) {
  const logger = createLogger()
  const tracingHeader = config.get('tracing.header')
  const traceId = getTraceId()

  logger.debug({ url }, 'Fetching authenticated data')

  return fetch(url, {
    ...options,
    method: options?.method || 'get',
    headers: {
      ...(options?.headers && options.headers),
      ...(traceId && { [tracingHeader]: traceId }),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
}

function authedFetcherDecorator(request) {
  return async (url, options = {}) => {
    const authedUser = await request.getUserSession()
    const token = authedUser?.token ?? null

    return authedFetcher(url, token, options).then(async (response) => {
      if (response.status === 401) {
        // Initial request has received a 401 from a call to an API. Refresh token and replay initial request
        const refreshTokenResponse = await refreshAccessToken(request)

        if (!refreshTokenResponse?.ok) {
          request.logger.debug({ refreshTokenResponse }, 'Token refresh failed')
          removeAuthenticatedUser(request)
        }

        if (refreshTokenResponse?.ok) {
          request.logger.debug(
            { refreshTokenResponse },
            'Token refresh succeeded'
          )

          await refreshUserSession(request, await refreshTokenResponse.json())

          const authedUser = await request.getUserSession()
          const newToken = authedUser?.token ?? null

          // Replay initial request with new token
          return await authedFetcher(url, newToken, options)
        }
      }

      try {
        return await handleResponse(response)
      } catch (error) {
        request.logger.debug({ error }, 'Authenticated Fetcher error')

        throw Boom.boomify(new Error(error.message), {
          statusCode: error?.output?.statusCode ?? 500
        })
      }
    })
  }
}

export { authedFetcherDecorator, authedFetcher }
/**
 * import { Response, RequestOptions } from 'node-fetch'
 */
