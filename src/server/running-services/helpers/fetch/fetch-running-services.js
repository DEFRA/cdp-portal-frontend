import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchRunningServices() {
  const endpoint = config.get('portalBackendApiUrl') + '/whats-running-where'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchRunningServices }
