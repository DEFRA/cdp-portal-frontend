import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchRunningServicesFilters() {
  const endpoint =
    config.get('portalBackendUrl') + '/v2/whats-running-where/filters'

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchRunningServicesFilters }
