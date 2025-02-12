import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCdpUser(userId) {
  const endpoint = config.get('userServiceBackendUrl') + `/users/${userId}`

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchCdpUser }
