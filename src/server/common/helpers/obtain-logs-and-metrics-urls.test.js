import { obtainLogsAndMetricsUrls } from './obtain-logs-and-metrics-urls.js'

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

    const result = obtainLogsAndMetricsUrls(entity, ['dev'])
    expect(result).toEqual({
      logsDetails: [
        {
          environment: 'dev'
        }
      ],
      metricsDetails: {
        dev: [
          {
            url: 'https://metrics.dev.cdp-int.defra.cloud/d/bevhbxy38eznkc/foo-backend-service',
            type: 'service',
            uid: 'bevhbxy38eznkc',
            version: 1
          },
          {
            url: 'https://metrics.dev.cdp-int.defra.cloud/d/apha-integration-bridge-oracledb/foo-backend-oracledb',
            type: 'oracledb',
            uid: 'apha-integration-bridge-oracledb',
            version: 33
          }
        ]
      }
    })
  })
})
