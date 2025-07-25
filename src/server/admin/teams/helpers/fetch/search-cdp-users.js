import { config } from '../../../../../config/config.js'
import { fetchJson } from '../../../../common/helpers/fetch/fetch-json.js'

async function searchCdpUsers(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    '/users' +
    `${query ? `?query=` + query : ''}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { searchCdpUsers }
