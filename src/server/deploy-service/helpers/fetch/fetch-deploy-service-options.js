import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchDeployServiceOptions() {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-service/options'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchDeployServiceOptions }
