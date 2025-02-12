import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

function fetchCdpUsers() {
  const endpoint = config.get('userServiceBackendUrl') + '/users'

  return fetchJson(endpoint)
}

export { fetchCdpUsers }
