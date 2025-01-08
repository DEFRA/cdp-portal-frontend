import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchBuckets(environment, serviceName, logger) {
  try {
    const endpoint =
      config.get('portalBackendUrl') +
      `/tenant-buckets/${serviceName}/${environment}`
    const { data } = await fetcher(endpoint)

    return data
  } catch (error) {
    // We are catching here because a 404 can be thrown when a service has not had buckets set up on an environment
    logger.info(
      error,
      'Buckets not found, has service had buckets set up on this environment?'
    )
    return null
  }
}

export { fetchBuckets }
