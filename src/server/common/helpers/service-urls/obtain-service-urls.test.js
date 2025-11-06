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

    expect(result.shutteredUrls).toEqual([
      {
        enabled: false,
        environment: 'dev',
        shuttered: true,
        type: 'internal',
        url: 'example-mock-service-frontend.dev.example.mock.clouds.net'
      }
    ])

    expect(result.serviceUrls).toEqual([
      {
        enabled: false,
        environment: 'management',
        shuttered: false,
        type: 'internal',
        url: 'example-mock-service-frontend.management.example.mock.clouds.net'
      },
      {
        enabled: false,
        environment: 'dev',
        shuttered: true,
        type: 'internal',
        url: 'example-mock-service-frontend.dev.example.mock.clouds.net'
      },
      {
        enabled: false,
        environment: 'ext-test',
        shuttered: false,
        type: 'internal',
        url: 'example-mock-service-frontend.ext-test.example.mock.clouds.net'
      }
    ])

    expect(result.vanityUrls).toEqual([
      {
        enabled: false,
        environment: 'infra-dev',
        shuttered: false,
        type: 'vanity',
        url: 'example-mock-service.gov.uk'
      }
    ])
  })
})
