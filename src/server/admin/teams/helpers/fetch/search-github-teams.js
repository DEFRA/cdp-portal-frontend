import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function searchGithubTeams(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    `/github-teams${query ? '?query=' + query : ''}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { searchGithubTeams }
