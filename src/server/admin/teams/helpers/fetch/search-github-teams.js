import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function searchGithubTeams(query) {
  const endpoint =
    config.get('userServiceApiUrl') +
    `/github-teams${query ? '?query=' + query : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { searchGithubTeams }
