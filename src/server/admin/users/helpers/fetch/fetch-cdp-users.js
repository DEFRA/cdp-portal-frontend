import { config } from '../../../../../config/config.js'
import { fetchJson } from '../../../../common/helpers/fetch/fetch-json.js'

function fetchCdpUsers() {
  const endpoint = config.get('userServiceBackendUrl') + '/users'

  return fetchJson(endpoint)
}

export { fetchCdpUsers }
