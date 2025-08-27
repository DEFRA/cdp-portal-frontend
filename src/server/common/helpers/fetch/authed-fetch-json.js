import Wreck from '@hapi/wreck'
import { getTraceId } from '@defra/hapi-tracing'

import { config } from '../../../../config/config.js'
import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'
import { handleResponse } from './handle-response.js'
import { removeAuthenticatedUser } from '../auth/user-session.js'

/**
 * Fetch JSON from a given URL with the provided token
 * @param {string} url
 * @param {string} token
 * @param {Wreck.options} options
 * @returns {Promise<{res: *, error}|{res: *, payload: *}>}
 */
async function authedFetchJson(url, token, options = {}) {
  const tracingHeader = config.get('tracing.header')
  const traceId = getTraceId()

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
    const userSession = await request.getUserSession()
    const token = userSession?.token ?? null

    return authedFetchJson(url, token, options).then(
      async ({ res, payload }) => {
        if (res.statusCode === statusCodes.unauthorized) {
          // Initial request has received a 401 from a call to an API. Refresh token and replay initial request

          try {
            const refetchedUserSession = await request.getUserSession()
            const newToken = refetchedUserSession?.token ?? null

            // Replay initial request with new token
            return await authedFetchJson(url, newToken, options)
          } catch (error) {
            request.logger.debug(
              error,
              'Token refresh failed - authedFetchJsonDecorator'
            )
            removeAuthenticatedUser(request)
          }
        }

        return handleResponse({ res, payload })
      }
    )
  }
}

export { authedFetchJsonDecorator, authedFetchJson }
