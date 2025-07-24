import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'
import { createLogger } from '../logging/logger.js'
import { statusCodes } from '../../constants/status-codes.js'

const logger = createLogger()

async function fetchLatestMigrations(serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/migrations/latest/${serviceName}`

    const { payload } = await fetchJson(endpoint)
    return payload ?? []
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === statusCodes.notFound) {
      logger.info('Migration not found')
    } else {
      logger.error(error)
    }

    return []
  }
}

export { fetchLatestMigrations }
