import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchDeployableServices() {
  const endpoint = config.get('portalBackendApiUrl') + '/services'

  try {
    const { json } = await fetcher(endpoint)
    return json
  } catch (error) {
    return []
  }
}

export { fetchDeployableServices }
