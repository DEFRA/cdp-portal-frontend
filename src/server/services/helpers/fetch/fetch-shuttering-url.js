import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchShutteringUrl(serviceName, url) {
  const endpoint =
    config.get('portalBackendUrl') + `/shuttering/${serviceName}/${url}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchShutteringUrl }
