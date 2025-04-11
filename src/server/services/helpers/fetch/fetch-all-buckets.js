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
    // We are catching here because a 404 because 404 is an expected error
    const statusCode = error.output.statusCode

    if (statusCode === 404) {
      logger.info('Tenant Bucket not found')
    } else {
      logger.error(error)
    }
  }
}

export { fetchAllBuckets }
