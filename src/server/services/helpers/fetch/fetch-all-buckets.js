import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

async function fetchAllBuckets(serviceName) {
  const endpoint =
    config.get('portalBackendUrl') + `/tenant-buckets/${serviceName}`

  try {
    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'Buckets error')
    return null
  }
}

export { fetchAllBuckets }
