import Boom from '@hapi/boom'

import {
  removeAuthenticatedUser,
  updateUserSession
} from '~/src/server/common/helpers/auth/user-session'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token'
import { throwHttpError } from '~/src/server/common/helpers/fetch/throw-http-error'

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

function authedFetcher(request) {
  return async (url, options = {}) => {
    const authedUser = await request.getUserSession()
    const token = authedUser?.token ?? null

    const fetchWithAuth = (token) => {
      request.logger.debug('Fetching with auth')
      request.logger.debug(`Token length is: ${token?.length}`)

      return fetch(url, {
        ...options,
        method: options?.method || 'get',
        headers: {
          ...(options?.headers && options.headers),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    }

    return fetchWithAuth(token).then(async (response) => {
      if (response.status === 401) {
        // Initial request has received a 401 from a call to an API. Refresh token and replay initial request
        const refreshTokenResponse = await refreshAccessToken(request)
        const refreshTokenResponseJson = await refreshTokenResponse.json()

        if (!refreshTokenResponse?.ok) {
          request.logger.debug({ refreshTokenResponse }, 'Token refresh failed')
          removeAuthenticatedUser(request)
        }

        if (refreshTokenResponse?.ok) {
          request.logger.debug(
            { refreshTokenResponse },
            'Token refresh succeeded'
          )
          await updateUserSession(request, refreshTokenResponseJson)

          const authedUser = await request.getUserSession()
          const newToken = authedUser?.token ?? null

          request.logger.debug(
            `Refreshed token, newToken length is: ${newToken?.length}`
          )

          // Replay initial request with new token
          return await fetchWithAuth(newToken)
        }
      }

      try {
        const json = await response.json()

        // status 200-299
        if (response?.ok) {
          return { json, response }
        }

        return throwHttpError(json, response)
      } catch (error) {
        request.logger.error(error, error.message)

        throw Boom.boomify(new Error(error.message), {
          statusCode: error?.output?.statusCode ?? 500
        })
      }
    })
  }
}

export { authedFetcher }
