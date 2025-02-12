import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

async function fetchAllBuckets(serviceName) {
  const endpoint =
    config.get('portalBackendUrl') + `/tenant-buckets/${serviceName}`

  try {
    const { payload } = await fetcher(endpoint)
    return payload
  } catch (error) {
    logger.debug(error, 'Buckets error')
    return null
  }
}

export { fetchAllBuckets }
