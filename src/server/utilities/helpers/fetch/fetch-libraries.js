import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchLibraries(teamId = null) {
  const endpoint =
    config.get('portalBackendApiUrl') +
    `/libraries${teamId ? `?team=${teamId}` : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchLibraries }
