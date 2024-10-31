import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCdpUsers() {
  const endpoint = config.get('userServiceBackendUrl') + '/users'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchCdpUsers }
