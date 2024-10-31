import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function searchCdpUsers(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    '/users' +
    `${query ? `?query=` + query : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { searchCdpUsers }
