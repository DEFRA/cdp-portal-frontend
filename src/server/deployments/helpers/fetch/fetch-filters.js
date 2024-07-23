import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchFilters() {
  const endpoint = config.get('portalBackendApiUrl') + '/v2/deployments/filters'

  try {
    const { json } = await fetcher(endpoint)
    return json
  } catch (error) {
    return {}
  }
}

export { fetchFilters }
