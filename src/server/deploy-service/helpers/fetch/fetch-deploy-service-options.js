import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

async function fetchDeployServiceOptions() {
  const endpoint =
    config.get('selfServiceOpsApiUrl') + '/deploy-service/options'

  const { json } = await fetcher(endpoint)
  return json
}

export { fetchDeployServiceOptions }
