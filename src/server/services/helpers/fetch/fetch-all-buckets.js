import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

async function fetchAllBuckets(serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/tenant-buckets/${serviceName}`
    const { data } = await fetcher(endpoint)

    return data
  } catch (error) {
    // A 404 can be thrown when a service has not had buckets set up on an environment
    createLogger().info(
      error,
      'Buckets not found, has service had buckets set up on this environment?'
    )
    return {}
  }
}

export { fetchAllBuckets }
