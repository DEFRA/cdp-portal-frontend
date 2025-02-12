import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchDeployableServicesFilters() {
  const endpoint = config.get('portalBackendUrl') + '/services/filters'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchDeployableServicesFilters }
