import { config } from '~/src/config/index.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

async function fetchDeployServiceOptions() {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-service/options'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchDeployServiceOptions }
