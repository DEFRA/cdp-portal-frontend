import { obtainServiceUrls } from './obtain-service-urls.js'
import { entitiesResourcesFixture } from '../../../../__fixtures__/entities/entity.js'

describe('#obtainServiceUrls', () => {
  test('returns empty arrays when environmentDetails is empty', () => {
    const result = obtainServiceUrls(entitiesResourcesFixture.environments, [
      'management',
      'dev',
      'ext-test',
      'infra-dev'
    ])

    expect(result.serviceUrls).toEqual([
      {
        environment: 'infra-dev',
        urls: []
      },
      {
        environment: 'management',
        urls: [
          {
            enabled: false,
            ingress_type: 'nginx',
            shuttered: false,
            type: 'internal',
            url: 'https://example-mock-service-frontend.management.example.mock.clouds.net'
          }
        ]
      },
      {
        environment: 'dev',
        urls: [
          {
            enabled: false,
            ingress_type: 'nginx',
            shuttered: true,
            type: 'internal',
            url: 'https://example-mock-service-frontend.dev.example.mock.clouds.net'
          }
        ]
      },
      {
        environment: 'ext-test',
        urls: [
          {
            enabled: false,
            ingress_type: 'nginx',
            shuttered: false,
            type: 'internal',
            url: 'https://example-mock-service-frontend.ext-test.example.mock.clouds.net'
          }
        ]
      }
    ])

    expect(result.vanityUrls).toEqual([
      {
        environment: 'infra-dev',
        urls: [
          {
            enabled: false,
            shuttered: false,
            type: 'vanity',
            url: 'https://example-mock-service.gov.uk'
          }
        ]
      }
    ])
  })
})
