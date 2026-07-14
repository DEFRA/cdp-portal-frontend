import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'

export async function getPendingResourceRequests(teamIds = []) {
  const teamFilters = teamIds.map((teamId) => `&teamIds=${teamId}`).join('')
  const endpoint = `${config.get('portalBackendUrl')}/resources/requests?status=requested&status=pending${teamFilters}`

  const { payload = {} } = await fetchJson(endpoint)

  return payload
}
