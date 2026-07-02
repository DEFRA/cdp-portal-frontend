export async function getPlayground(serviceName) {
  // TODO: fetch
  return Promise.resolve({
    alerts: [
      {
        name: 'btms-gateway-health-status',
        type: 'custom',
        uid: 'e9821b3c84ffdfc70d30319ed096a0343f5aecf0',
        annotations: {
          description: 'BTMS Gateway service health check',
          runbook_url:
            'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
          summary:
            "BTMS Gateway health check of the application and it's dependencies."
        }
      }
    ],
    dashboards: [
      {
        url: 'https://metrics.prod.cdp-int.defra.cloud/d/btms-gateway-all-3da12fe2/btms-gateway-all',
        type: 'custom',
        uid: 'btms-gateway-all-3da12fe2',
        scope: '',
        version: 1
      }
    ]
  })
}
