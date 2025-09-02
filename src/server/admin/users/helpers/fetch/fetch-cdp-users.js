import { config } from '../../../../../config/config.js'
import { fetchJson } from '../../../../common/helpers/fetch/fetch-json.js'

async function fetchCdpUsers() {
  const endpoint = config.get('userServiceBackendUrl') + '/users'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchCdpUsers }
