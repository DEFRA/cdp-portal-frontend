import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchRunningServices(serviceId) {
  const endpoint =
    config.get('portalBackendUrl') + `/whats-running-where/${serviceId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchRunningServices }
