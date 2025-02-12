import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchCdpUser(userId) {
  const endpoint = config.get('userServiceBackendUrl') + `/users/${userId}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchCdpUser }
