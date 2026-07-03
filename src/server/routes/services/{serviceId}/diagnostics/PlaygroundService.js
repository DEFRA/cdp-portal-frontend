import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'

export async function getPlayground(serviceName) {
  const endpoint = `${config.get('portalBackendUrl')}/entities/${serviceName}/diagnostics/playground`

  const { res, payload = {} } = await fetchJson(endpoint)

  // BE fetching from queues
  if (res.statusCode === 204) {
    return {
      alerts: 'PENDING',
      dashboards: 'PENDING'
    }
  }

  return {
    alerts: payload?.alerts ?? [],
    dashboards: payload?.dashboards ?? []
  }
}
