import { config } from '../../../../../config/config.js'
import { fetchJson } from '../../../../common/helpers/fetch/fetch-json.js'

async function searchAzureActiveDirectoryUsers(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    `/aad-users${query ? '?query=' + query : ''}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { searchAzureActiveDirectoryUsers }
