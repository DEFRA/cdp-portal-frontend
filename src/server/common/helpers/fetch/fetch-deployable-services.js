import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchDeployableServices() {
  const endpoint = config.get('portalBackendUrl') + '/services'

  const { data } = await fetcher(endpoint)
  return data
}

export { fetchDeployableServices }
