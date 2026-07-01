import { obtainTelemetryUrls } from './obtain-telemetry-urls.js'

describe('#obtainLogsAndMetricsUrls', () => {
  test('#custom metrics have their type replaced using the url data', () => {
    const entity = {
      name: 'foo-backend',
      environments: {
        dev: {
          logs: [],
          metrics: [
            {
              url: 'https://metrics.dev.cdp-int.defra.cloud/d/bevhbxy38eznkc/foo-backend-service',
              type: 'service',
              uid: 'bevhbxy38eznkc',
              version: 1
            },
            {
              url: 'https://metrics.dev.cdp-int.defra.cloud/d/apha-integration-bridge-oracledb/foo-backend-oracledb',
              type: 'custom',
              uid: 'apha-integration-bridge-oracledb',
              version: 33
            }
          ]
        }
      }
    }

    const result = obtainTelemetryUrls(entity, ['dev'])
    expect(result).toEqual({
      logsUrls: [
        {
          environment: 'dev',
          urls: [
            {
              label: 'https://logs.dev.cdp-int.defra.cloud',
              testId: 'app-logs-dashboard-link'
            }
          ]
        }
      ],
      metricsUrls: [
        {
          environment: 'dev',
          urls: [
            {
              label: 'Service - https://metrics.dev.cdp-int.defra.cloud',
              type: 'service',
              uid: 'bevhbxy38eznkc',
              url: 'https://metrics.dev.cdp-int.defra.cloud/d/bevhbxy38eznkc/foo-backend-service',
              version: 1
            },
            {
              label: 'Oracledb - https://metrics.dev.cdp-int.defra.cloud',
              type: 'oracledb',
              uid: 'apha-integration-bridge-oracledb',
              url: 'https://metrics.dev.cdp-int.defra.cloud/d/apha-integration-bridge-oracledb/foo-backend-oracledb',
              version: 33
            }
          ]
        }
      ]
    })
  })
})
