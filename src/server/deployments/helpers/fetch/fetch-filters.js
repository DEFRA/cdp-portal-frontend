import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchFilters() {
  const endpoint = config.get('portalBackendApiUrl') + '/v2/deployments/filters'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchFilters }
