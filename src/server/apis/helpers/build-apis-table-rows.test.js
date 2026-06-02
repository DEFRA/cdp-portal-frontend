import { buildApisTableRows } from './build-apis-table-rows.js'

describe('#buildApisTableRows', () => {
  test('builds sorted rows for services with api_docs running in environments', () => {
    const environments = ['dev', 'test', 'prod']
    const services = [
      {
        name: 'zeta-service',
        teams: [{ name: 'Team Z' }],
        metadata: {
          api_docs: {
            doc_type: 'openapi'
          }
        }
      },
      {
        name: 'alpha-service',
        teams: [{ name: 'Team A' }],
        metadata: {
          api_docs: {
            doc_type: 'openapi'
          }
        }
      },
      {
        name: 'no-api-docs',
        teams: [{ name: 'Team N' }],
        metadata: {}
      },
      {
        name: 'not-running-service',
        teams: [{ name: 'Team R' }],
        metadata: {
          api_docs: {
            doc_type: 'openapi'
          }
        }
      }
    ]
    const runningServices = [
      { service: 'zeta-service', environment: 'prod' },
      { service: 'alpha-service', environment: 'dev' },
      { service: 'alpha-service', environment: 'test' }
    ]

    const rows = buildApisTableRows({
      services,
      runningServices,
      environments
    })

    expect(rows).toEqual([
      {
        serviceName: 'alpha-service',
        teams: 'Team A',
        format: 'openapi',
        envLinks: {
          dev: 'https://cdp-api-hub.dev.cdp-int.defra.cloud/hub/internal/alpha-service',
          test: 'https://cdp-api-hub.test.cdp-int.defra.cloud/hub/internal/alpha-service'
        },
        hasLinks: true
      },
      {
        serviceName: 'zeta-service',
        teams: 'Team Z',
        format: 'openapi',
        envLinks: {
          prod: 'https://cdp-api-hub.prod.cdp-int.defra.cloud/hub/internal/zeta-service'
        },
        hasLinks: true
      }
    ])
  })

  test('returns empty rows for empty inputs', () => {
    expect(
      buildApisTableRows({
        services: [],
        runningServices: [],
        environments: ['dev']
      })
    ).toEqual([])
  })
})
