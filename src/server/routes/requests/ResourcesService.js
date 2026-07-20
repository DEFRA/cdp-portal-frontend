import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'
import { addDays } from 'date-fns'

export async function getPendingResourceRequests(teamIds = []) {
  const teamFilters = teamIds.map((teamId) => `&teamIds=${teamId}`).join('')
  const endpoint = `${config.get('portalBackendUrl')}/resources/requests?status=requested&status=pending${teamFilters}`

  const { payload = {} } = await fetchJson(endpoint)

  return payload
}

export async function getRecentNonPendingResourceRequests(teamIds = []) {
  const teamFilters = teamIds.map((teamId) => `&teamIds=${teamId}`).join('')
  const OneDayOld = addDays(new Date(), -1).toISOString()
  const endpoint = `${config.get('portalBackendUrl')}/resources/requests?modifiedAfter=${OneDayOld}&status=created&status=closed&status=failed${teamFilters}`

  const { payload = {} } = await fetchJson(endpoint)

  return payload
}

export async function getResourceRequest(id) {
  const endpoint = `${config.get('portalBackendUrl')}/resources/requests/${id}`

  const { payload = {} } = await fetchJson(endpoint)

  return payload
}
