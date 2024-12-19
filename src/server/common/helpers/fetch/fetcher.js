import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { handleResponse } from '~/src/server/common/helpers/fetch/handle-response.js'
import { getTraceId } from '@defra/hapi-tracing'

/**
 * @param {string} url
 * @param {RequestOptions} options
 * @param {boolean} logError
 * @returns {Promise<{data: {object}, response: {Response}}>}
 */
async function fetcher(url, options = {}, logError = true) {
  const logger = createLogger()
  const tracingHeader = config.get('tracing.header')
  const traceId = getTraceId()

  logger.debug({ url }, 'Fetching data')

  const response = await fetch(url, {
    ...options,
    method: options?.method || 'get',
    headers: {
      ...(options?.headers && options.headers),
      ...(traceId && { [tracingHeader]: traceId }),
      'Content-Type': 'application/json'
    }
  })

  try {
    return await handleResponse(response)
  } catch (error) {
    if (logError) {
      logger.error(error, error.message)
    }
    throw Boom.boomify(new Error(error.message), {
      statusCode: error?.output?.statusCode ?? 500
    })
  }
}

export { fetcher }
/**
 * import { Response, RequestOptions } from 'node-fetch'
 */
