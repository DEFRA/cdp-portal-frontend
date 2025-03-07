import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

const logger = createLogger()

/**
 * @typedef {object} TenantService
 * @property {string} serviceCode - Service Code
 * @property {zone} region - CDP Platform Zone
 */

/**
 * @typedef {object} TenantServices
 * @property {TenantService=} dev
 * @property {TenantService=} test
 * @property {TenantService=} perf-test
 * @property {TenantService=} ext-test
 * @property {TenantService=} prod
 * @property {TenantService=} management
 * @property {TenantService=} infra-dev
 */

/**
 *
 * @param {string} serviceName
 * @returns {Promise<TenantServices|null>}
 */
async function fetchTenantService(serviceName) {
  try {
    const endpoint =
      config.get('portalBackendUrl') + `/tenant-services/${serviceName}`
    const { payload } = await fetchJson(endpoint)

    return payload
  } catch (error) {
    // We are catching here because a 404 can be thrown when a tenant service has not been created
    logger.info(error, 'Tenant Service not found.')
    return null
  }
}

export { fetchTenantService }
