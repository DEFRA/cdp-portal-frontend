import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchDeployableServices() {
  const endpoint = config.get('portalBackendApiUrl') + '/services'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchDeployableServices }
