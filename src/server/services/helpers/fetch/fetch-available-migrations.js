import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'
import { createLogger } from '../../../common/helpers/logging/logger.js'
import { statusCodes } from '@defra/cdp-validation-kit'

const logger = createLogger()

/**
 * @param {string} serviceName
 * @returns {Promise<*|*[]>}
 */
async function fetchAvailableMigrations(serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/migrations/services/${serviceName}`

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

export { fetchAvailableMigrations }
