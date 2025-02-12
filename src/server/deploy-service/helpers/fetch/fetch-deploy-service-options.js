import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchDeployServiceOptions() {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-service/options'

  const { payload } = await fetcher(endpoint)
  return payload
}

export { fetchDeployServiceOptions }
