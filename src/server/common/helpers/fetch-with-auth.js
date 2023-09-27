import fetch from 'node-fetch'

import { sessionNames } from '~/src/server/common/constants/session-names'

function fetchWithAuth(request) {
  return (url, options = {}) => {
    const { token } = request.yar.get(sessionNames.user)

    return fetch(url, {
      ...options,
      headers: {
        ...(options?.headers && options?.headers),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export { fetchWithAuth }
