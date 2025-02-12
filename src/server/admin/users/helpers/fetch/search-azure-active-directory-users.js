import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function searchAzureActiveDirectoryUsers(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    `/aad-users${query ? '?query=' + query : ''}`

  const { payload } = await fetcher(endpoint)
  return payload
}

export { searchAzureActiveDirectoryUsers }
