import Wreck from '@hapi/wreck'
import { getTraceId } from '@defra/hapi-tracing'

import { config } from '~/src/config/config.js'
import { handleResponse } from '~/src/server/common/helpers/fetch/handle-response.js'

/**
 * Fetch JSON from a given URL
 * @param {string} url
 * @param {Wreck.options} options
 * @returns {Promise<{res: *, error}|{res: *, payload: *}>}
 */
async function fetchJson(url, options = {}) {
  const tracingHeader = config.get('tracing.header')
  const traceId = getTraceId()

  const method = (options?.method || 'get').toLowerCase()

  const { res, payload } = await Wreck[method](url, {
    ...options,
    json: true,
    headers: {
      ...(options?.headers && options.headers),
      ...(traceId && { [tracingHeader]: traceId }),
      'Content-Type': 'application/json'
    }
  })

  return handleResponse({ res, payload })
}

export { fetchJson }
