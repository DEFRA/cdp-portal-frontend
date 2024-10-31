import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchCdpUser(userId) {
  const endpoint = config.get('userServiceBackendUrl') + `/users/${userId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchCdpUser }
