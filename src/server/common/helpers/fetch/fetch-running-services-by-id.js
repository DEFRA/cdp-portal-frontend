import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchRunningServicesById(serviceId) {
  const endpoint =
    config.get('portalBackendUrl') + `/v2/whats-running-where/${serviceId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRunningServicesById }
