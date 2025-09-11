import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'

export async function fetchAudit() {
  const endpoint = `${config.get('portalBackendUrl')}/audit`

  const { payload } = await fetchJson(endpoint)
  return payload
}
