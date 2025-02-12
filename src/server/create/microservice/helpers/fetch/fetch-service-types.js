import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchServiceTypes() {
  const endpoint = config.get('portalBackendUrl') + '/service-types'

  const { payload } = await fetchJson(endpoint)
  return payload
}

export { fetchServiceTypes }
