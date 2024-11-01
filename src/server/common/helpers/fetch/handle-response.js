import { throwHttpError } from '~/src/server/common/helpers/fetch/throw-http-error.js'

/**
 * @param {Response} response
 * @returns {Promise<{data: {object}, response: {Response}}>}
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type')
  let data

  if (contentType === null) {
    data = null
  }

  if (contentType?.startsWith('application/json;')) {
    data = await response.json()
  }

  if (contentType?.startsWith('text/plain;')) {
    data = await response.text()
  }

  // status 200-299
  if (response?.ok) {
    return { data, response }
  }

  throwHttpError(data, response)
}

export { handleResponse }
