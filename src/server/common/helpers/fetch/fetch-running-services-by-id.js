import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchRunningServicesById(serviceId) {
  const endpoint =
    config.get('portalBackendUrl') + `/v2/whats-running-where/${serviceId}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchRunningServicesById }
