import { config } from '../../../../../config/config.js'
import { fetchJson } from '../../../../common/helpers/fetch/fetch-json.js'

async function fetchCdpTeams() {
  const endpoint = config.get('userServiceBackendUrl') + '/teams'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchCdpTeams }
