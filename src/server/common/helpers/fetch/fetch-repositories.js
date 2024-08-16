import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchRepositories(teamId = null) {
  const endpoint =
    config.get('portalBackendUrl') +
    `/repositories${teamId ? `?team=${teamId}` : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRepositories }
