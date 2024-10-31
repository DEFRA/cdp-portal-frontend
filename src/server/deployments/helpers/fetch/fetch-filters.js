import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchFilters() {
  const endpoint = config.get('portalBackendUrl') + '/v2/deployments/filters'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchFilters }
