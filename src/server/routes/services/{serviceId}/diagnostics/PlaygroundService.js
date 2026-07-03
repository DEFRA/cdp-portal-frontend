import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'

export async function getPlayground(serviceName) {
  const endpoint = `${config.get('portalBackendUrl')}/entities/${serviceName}/diagnostics/playground`

  try {
    const { payload = {} } = await fetchJson(endpoint)
    return {
      alerts: payload?.alerts ?? [],
      dashboards: payload?.dashboards ?? []
    }
  } catch (_) {
    return {
      alerts: 'PENDING',
      dashboards: 'PENDING'
    }
  }
}
