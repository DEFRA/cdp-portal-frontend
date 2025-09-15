import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'
import { createLogger } from '../logging/logger.js'

const logger = createLogger()
const portalBackendUrl = config.get('portalBackendUrl')

async function fetchTenantDatabase(serviceName) {
  try {
    const endpoint = `${portalBackendUrl}/tenant-databases/${serviceName}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === 404) {
      logger.info(`Tenant Database ${serviceName} not found`)
    } else {
      logger.error(error)
    }

    return {}
  }
}

async function fetchTenantDatabaseByEnvironment(serviceName, environment) {
  try {
    const endpoint = `${portalBackendUrl}/tenant-databases/${serviceName}/${environment}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === 404) {
      logger.info(
        `Tenant Database: ${serviceName}, in ${environment} not found`
      )
    } else {
      logger.error(error)
    }

    return {}
  }
}

export { fetchTenantDatabase, fetchTenantDatabaseByEnvironment }
