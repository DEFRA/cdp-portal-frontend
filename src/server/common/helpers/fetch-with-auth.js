import fetch from 'node-fetch'

import { sessionNames } from '~/src/server/common/constants/session-names'

function fetchWithAuth(request) {
  return (url, options = {}) => {
    const auth = request.yar.get(sessionNames?.auth)
    const token = auth?.credentials?.token

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
