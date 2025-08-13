import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'
import { createLogger } from '../logging/logger.js'

const logger = createLogger()
const portalBackendUrl = config.get('portalBackendUrl')

async function fetchTenantService(serviceName) {
  try {
    const endpoint = `${portalBackendUrl}/tenant-services/${serviceName}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === 404) {
      logger.info(`Tenant Service ${serviceName} not found`)
    } else {
      logger.error(error)
    }

    return {}
  }
}

async function fetchTenantServiceByEnvironment(serviceName, environment) {
  try {
    const endpoint = `${portalBackendUrl}/tenant-services/${serviceName}/${environment}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    const statusCode = error.output.statusCode

    if (statusCode === 404) {
      logger.info(`Tenant Service: ${serviceName}, in ${environment} not found`)
    } else {
      logger.error(error)
    }

    return {}
  }
}

export { fetchTenantService, fetchTenantServiceByEnvironment }
