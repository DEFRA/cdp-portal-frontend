import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'

async function fetchRunningServicesFilters() {
  const endpoint = config.get('portalBackendUrl') + '/running-services/filters'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchRunningServicesFilters }
