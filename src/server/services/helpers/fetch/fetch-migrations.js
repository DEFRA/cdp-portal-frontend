import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

const logger = createLogger()

async function fetchMigrations(serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/migrations/available/${serviceName}`

    const { payload } = await fetchJson(endpoint)
    return payload
  } catch (error) {
    // We are catching here because a 404 can be thrown when a tenant service has not been created
    const statusCode = error.output.statusCode

    if (statusCode === statusCodes.notFound) {
      logger.info('Migration not found')
    } else {
      logger.error(error)
    }

    return []
  }
}

export { fetchMigrations }
