import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function searchAzureActiveDirectoryUsers(query) {
  const endpoint =
    config.get('userServiceApiUrl') +
    `/aad-users${query ? '?query=' + query : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { searchAzureActiveDirectoryUsers }
