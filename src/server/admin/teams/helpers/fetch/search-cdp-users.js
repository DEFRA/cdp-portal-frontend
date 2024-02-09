import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function searchCdpUsers(query) {
  const endpoint =
    config.get('userServiceApiUrl') +
    '/users' +
    `${query ? `?query=` + query : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { searchCdpUsers }
