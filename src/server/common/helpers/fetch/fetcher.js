import Wreck from '@hapi/wreck'
import { getTraceId } from '@defra/hapi-tracing'

import { config } from '~/src/config/config.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { handleResponse } from '~/src/server/common/helpers/fetch/handle-response.js'

async function fetcher(url, options = {}) {
  const logger = createLogger()
  const tracingHeader = config.get('tracing.header')
  const traceId = getTraceId()

  logger.debug({ url }, 'Fetching data')

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

export { fetcher }
/**
 * import { Response, RequestOptions } from 'node-fetch'
 */
