import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function searchCdpUsers(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    '/users' +
    `${query ? `?query=` + query : ''}`

  const { data } = await fetcher(endpoint)
  return data
}

export { searchCdpUsers }
