import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'

export async function getPlayground(serviceName) {
  const endpoint = `${config.get('portalBackendUrl')}/entities/${serviceName}/grafana/playground`

  const { res, payload = {} } = await fetchJson(endpoint)

  // BE fetching from queues
  if (res.statusCode === 202) {
    return {
      status: 'LOADING',
      alerts: [],
      dashboards: []
    }
  }

  const isPromoting = payload?.dashboards?.some(
    (dashboard) => dashboard.promotion_request
  )

  return {
    status: isPromoting ? 'PROMOTING' : 'LOADED',
    alerts: payload?.alerts ?? [],
    dashboards:
      payload?.dashboards?.map((dashboard) => ({
        ...dashboard,
        url: `https://metrics.dev.cdp-int.defra.cloud${dashboard.url}`
      })) ?? []
  }
}

export async function promoteDashboard(request, serviceName, uid) {
  const endpoint = `${config.get('portalBackendUrl')}/entities/${serviceName}/grafana/playground/promotions/dashboards/${uid}`

  return await request.authedFetchJson(endpoint, {
    method: 'POST'
  })
}

export async function promoteAlerts(request, serviceName) {
  const endpoint = `${config.get('portalBackendUrl')}/entities/${serviceName}/grafana/playground/promotions/alerts`

  return await request.authedFetchJson(endpoint, {
    method: 'POST'
  })
}
