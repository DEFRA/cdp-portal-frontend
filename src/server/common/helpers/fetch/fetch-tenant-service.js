import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

/**
 * @typedef {object} ServiceInfo
 * @property {string} serviceCode - Service Code
 * @property {("public" | "protected")} zone - CDP Platform Zone
 */

/**
 * @typedef {{[key: ("prod" | "perf-test" | "dev" | "test" | "management" | "infra-dev" | "ext-test")]: {ServiceInfo}}} TenantService
 */

/**
 * @typedef {object} TenantServices
 * @property {TenantService} dev
 * @property {TenantService} test
 * @property {TenantService} perf-test
 * @property {TenantService} ext-test
 * @property {TenantService} prod
 * @property {TenantService} management
 * @property {TenantService} infra-dev
 */

/**
 * @param {string} serviceName
 * @returns {Promise<TenantServices|{}>}
 */
async function fetchTenantService(serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/tenant-services/${serviceName}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    // We are catching here because a 404 can be thrown when a tenant service has not been created
    const statusCode = error.output.statusCode

    if (statusCode === 404) {
      logger.info(error, 'Tenant Service not found.')
    } else {
      logger.error(error)
    }

    return {}
  }
}

export { fetchTenantService }
