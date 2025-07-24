import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'
import { createLogger } from '../logging/logger.js'

const logger = createLogger()

async function fetchBuckets(environment, serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') +
      `/tenant-buckets/${serviceName}/${environment}`
    const { payload } = await fetchJson(endpoint)

    return payload
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
