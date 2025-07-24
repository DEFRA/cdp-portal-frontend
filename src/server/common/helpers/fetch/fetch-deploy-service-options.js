import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'

async function fetchDeployServiceOptions() {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-service/options'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchDeployServiceOptions }
