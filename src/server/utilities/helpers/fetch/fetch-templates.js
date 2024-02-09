import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchTemplates(teamId = null) {
  const endpoint =
    config.get('portalBackendApiUrl') +
    `/templates${teamId ? `?team=${teamId}` : ''}`

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchTemplates }
