import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function searchAzureActiveDirectoryUsers(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    `/aad-users${query ? '?query=' + query : ''}`

  const { data } = await fetcher(endpoint)
  return data
}

export { searchAzureActiveDirectoryUsers }
