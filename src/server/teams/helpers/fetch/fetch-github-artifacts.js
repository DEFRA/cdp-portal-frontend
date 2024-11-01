import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchGithubArtifacts(teamId) {
  const endpoint = config.get('portalBackendUrl') + `/github-repo/${teamId}`

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchGithubArtifacts }
