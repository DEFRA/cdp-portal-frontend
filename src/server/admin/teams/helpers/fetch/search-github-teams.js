import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function searchGithubTeams(query) {
  const endpoint =
    config.get('userServiceBackendUrl') +
    `/github-teams${query ? '?query=' + query : ''}`

  const { data } = await fetcher(endpoint)
  return data
}

export { searchGithubTeams }
