import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { handleResponse } from '~/src/server/common/helpers/fetch/handle-response.js'
import { getTraceId } from '~/src/server/common/helpers/tracing/tracing.js'

/**
 * @param {string} url
 * @param {RequestOptions} options
 * @returns {Promise<{data: {object}, response: {Response}}>}
 */
async function fetcher(url, options = {}) {
  const logger = createLogger()
  const response = await fetch(url, {
    ...options,
    method: options?.method || 'get',
    headers: {
      ...(options?.headers && options.headers),
      'Content-Type': 'application/json',
      ...(getTraceId() ? { 'x-cdp-request-id': getTraceId() } : {})
    }
  })

  try {
    return await handleResponse(response)
  } catch (error) {
    logger.error(error, error.message)

    throw Boom.boomify(new Error(error.message), {
      statusCode: error?.output?.statusCode ?? 500
    })
  }
}

export { fetcher }
/**
 * import { Response, RequestOptions } from 'node-fetch'
 */
