import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchGithubArtifacts(teamId) {
  const endpoint = config.get('portalBackendUrl') + `/github-repo/${teamId}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchGithubArtifacts }
