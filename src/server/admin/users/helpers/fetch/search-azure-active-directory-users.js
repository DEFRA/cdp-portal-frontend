import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function searchAzureActiveDirectoryUsers(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    `/aad-users${query ? '?query=' + query : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { searchAzureActiveDirectoryUsers }
