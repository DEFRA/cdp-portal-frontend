import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCdpUser(userId) {
  const endpoint = config.get('userServiceBackendUrl') + `/users/${userId}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchCdpUser }
