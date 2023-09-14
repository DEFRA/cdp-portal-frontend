import fetch from 'node-fetch'
import { isNil } from 'lodash'

/**
 * Fetch with authorization function
 *
 * @return Promise
 * @param {Object} auth       The auth object that contains the access token
 * @param {string} url        The URL to call
 * @param {Object} options    Optional parameters for body, method, and extra headers
 */
async function fetchWithAuth(auth, url, options = {}) {
  const method = options.method || 'post'
  const body = options.body || null
  const extraHeaders = options.extraHeaders || {}

  const headers = { ...extraHeaders, 'Content-Type': 'application/json' }
  const token = auth?.credentials?.token

  if (!isNil(token)) {
    headers.Authorization = `Bearer ${token}`
  }

  if (isNil(body)) {
    return await fetch(url, {
      method,
      headers
    })
  } else {
    return await fetch(url, {
      method,
      body,
      headers
    })
  }
}

export { fetchWithAuth }
