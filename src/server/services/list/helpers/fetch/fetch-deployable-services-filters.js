import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchDeployableServicesFilters() {
  const endpoint = config.get('portalBackendUrl') + '/services/filters'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchDeployableServicesFilters }
