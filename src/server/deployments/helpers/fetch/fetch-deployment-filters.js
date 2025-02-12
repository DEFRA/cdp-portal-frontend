import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchDeploymentFilters() {
  const endpoint = config.get('portalBackendUrl') + '/v2/deployments/filters'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchDeploymentFilters }
