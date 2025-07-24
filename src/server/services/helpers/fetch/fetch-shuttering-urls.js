import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchShutteringUrls(serviceName) {
  const endpoint = config.get('portalBackendUrl') + `/shuttering/${serviceName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchShutteringUrls }
