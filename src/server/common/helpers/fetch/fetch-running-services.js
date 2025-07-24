import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'

async function fetchRunningServices(serviceId) {
  const endpoint =
    config.get('portalBackendUrl') + `/running-services/${serviceId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchRunningServices }
