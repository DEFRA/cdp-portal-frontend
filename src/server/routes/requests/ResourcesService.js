import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'

export async function getPendingResourceRequests() {
  const endpoint = `${config.get('portalBackendUrl')}/resources/requests?status=requested&status=pending`

  const { payload = {} } = await fetchJson(endpoint)

  return payload
}
