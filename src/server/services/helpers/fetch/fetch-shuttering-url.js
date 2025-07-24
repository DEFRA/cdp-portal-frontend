import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchShutteringUrl(url) {
  const endpoint = config.get('portalBackendUrl') + `/shuttering/url/${url}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchShutteringUrl }
