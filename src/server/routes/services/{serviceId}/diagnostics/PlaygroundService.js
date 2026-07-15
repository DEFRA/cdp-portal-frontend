import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'

export async function getPlayground(serviceName) {
  const endpoint = `${config.get('portalBackendUrl')}/entities/${serviceName}/diagnostics/playground`

  try {
    const { res, payload = {} } = await fetchJson(endpoint)

    // BE fetching from queues
    if (res.statusCode === 202) {
      return {
        alerts: 'PENDING',
        dashboards: 'PENDING'
      }
    }

    return {
      alerts: payload?.alerts ?? [],
      dashboards:
        payload?.dashboards?.map((dashboard) => ({
          ...dashboard,
          url: `https://metrics.dev.cdp-int.defra.cloud${dashboard.url}`
        })) ?? []
    }
  } catch (_) {
    return { alerts: [], dashboards: [] }
  }
}

export async function promoteDashboards(request, uids) {
  const endpoint = `${config.get('portalBackendUrl')}/grafana/promotions`

  return await request.authedFetchJson(endpoint, {
    method: 'POST',
    body: {
      dashboards: uids.map((uid) => ({ dashboard_uid: uid }))
    }
  })
}

export async function promoteAlerts(request, serviceName) {
  const endpoint = `${config.get('portalBackendUrl')}/grafana/promotions`

  return await request.authedFetchJson(endpoint, {
    method: 'POST',
    body: {
      alerts: [
        {
          service_name: serviceName
        }
      ]
    }
  })
}
