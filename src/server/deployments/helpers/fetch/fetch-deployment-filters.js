import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchDeploymentFilters() {
  const endpoint = config.get('portalBackendUrl') + '/v2/deployments/filters'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchDeploymentFilters }
