import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

/**
 * @param {string} serviceName
 * @returns {Promise<*>}
 */
async function fetchAvailableVersions(serviceName) {
  const endpoint =
    config.get('portalBackendUrl') + `/deployables/${serviceName}`

  const { payload } = await fetchJson(endpoint)

  return payload.filter((version) => version.tag !== '0.0.0')
}

export { fetchAvailableVersions }
