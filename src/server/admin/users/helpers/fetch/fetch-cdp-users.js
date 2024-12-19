import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCdpUsers() {
  const endpoint = config.get('userServiceBackendUrl') + '/users'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchCdpUsers }
