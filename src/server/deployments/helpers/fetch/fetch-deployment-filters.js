import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchDeploymentFilters() {
  const endpoint = config.get('portalBackendUrl') + '/deployments/filters'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchDeploymentFilters }
