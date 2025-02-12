import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

function fetchCdpUsers() {
  const endpoint = config.get('userServiceBackendUrl') + '/users'

  return fetcher(endpoint)
}

export { fetchCdpUsers }
