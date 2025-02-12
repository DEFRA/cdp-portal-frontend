import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchRunningServicesFilters() {
  const endpoint =
    config.get('portalBackendUrl') + '/v2/whats-running-where/filters'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchRunningServicesFilters }
