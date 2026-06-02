import { obtainApiHubUrls } from './obtain-api-hub-urls.js'

describe('#obtainApiHubUrls', () => {
  test('returns deterministic urls for available environments when api_docs is present', () => {
    const entity = {
      name: 'example-service',
      metadata: {
        api_docs: {
          url: '/openapi/v1.json',
          doc_type: 'openapi'
        }
      },
      environments: {
        dev: {},
        test: {}
      }
    }

    expect(obtainApiHubUrls(entity, ['test', 'dev', 'prod'])).toEqual([
      {
        environment: 'dev',
        url: 'https://cdp-api-hub.dev.cdp-int.defra.cloud/hub/internal/example-service'
      },
      {
        environment: 'test',
        url: 'https://cdp-api-hub.test.cdp-int.defra.cloud/hub/internal/example-service'
      }
    ])
  })

  test('returns an empty list when entity has no api_docs metadata', () => {
    const entity = {
      name: 'example-service',
      metadata: {},
      environments: {
        dev: {}
      }
    }

    expect(obtainApiHubUrls(entity, ['dev'])).toEqual([])
  })
})
