import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function searchGithubTeams(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    `/github-teams${query ? '?query=' + query : ''}`

  const { payload } = await fetcher(endpoint)
  return payload
}

export { searchGithubTeams }
