import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function searchGithubUsers(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    `/github-users${query ? '?query=' + query : ''}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { searchGithubUsers }
