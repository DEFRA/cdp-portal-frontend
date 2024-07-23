import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchRunningServicesById(serviceId) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/v2/whats-running-where/${serviceId}`

  try {
    const { json } = await fetcher(endpoint)
    return json
  } catch (error) {
    return []
  }
}

export { fetchRunningServicesById }
