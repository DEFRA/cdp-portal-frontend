import fetch from 'node-fetch'

import {
  removeUserSession,
  updateUserSession
} from '~/src/server/common/helpers/auth/user-session'
import { refreshAccessToken } from '~/src/server/common/helpers/auth/refresh-token'

function fetchWithAuth(request) {
  return async (url, options = {}) => {
    const authedUser = await request.getUserSession()
    const token = authedUser?.token ?? null

    const fetcher = (token) =>
      fetch(url, {
        ...options,
        headers: {
          ...(options?.headers && options?.headers),
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

    return fetcher(token).then(async (response) => {
      if (response.status === 401) {
        // Initial request has received a 401 from a call to an API. Refresh token and replay initial request
        const refreshTokenResponse = await refreshAccessToken(request)
        const refreshTokenResponseJson = await refreshTokenResponse.json()

        if (!refreshTokenResponse.ok) {
          removeUserSession(request)
        }

        if (refreshTokenResponse.ok) {
          await updateUserSession(request, refreshTokenResponseJson)

          const authedUser = await request.getUserSession()
          const newToken = authedUser?.token ?? null

          // Replay initial request with new token
          return await fetcher(newToken)
        }
      }

      return response
    })
  }
}

export { fetchWithAuth }
