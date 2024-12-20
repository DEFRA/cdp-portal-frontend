import nock from 'nock'

import { config } from '~/src/config/config.js'
import { vanityUrlsFixture } from '~/src/__fixtures__/vanity-urls.js'
import { provideVanityUrls } from '~/src/server/services/about/transformers/vanity-urls.js'

describe('#provideVanityUrls', () => {
  const serviceName = 'cdp-portal-frontend'
  const vanityUrlsEndpoint =
    config.get('portalBackendUrl') + `/vanity-urls/${serviceName}`
  const vanityUrlsEndpointUrl = new URL(vanityUrlsEndpoint)
  let result

  describe('With vanity url response', () => {
    beforeEach(async () => {
      nock(vanityUrlsEndpointUrl.origin)
        .get(vanityUrlsEndpointUrl.pathname)
        .reply(200, vanityUrlsFixture)

      result = await provideVanityUrls({
        params: { serviceId: 'cdp-portal-frontend' },
        logger: { debug: jest.fn() }
      })
    })

    test('Should provide expected available versions', () => {
      expect(result).toEqual([
        {
          environment: 'infra-dev',
          urls: ['https://portal-test.cdp-int.defra.cloud']
        },
        {
          environment: 'management',
          urls: ['https://portal.cdp-int.defra.cloud']
        },
        {
          environment: 'dev',
          urls: ['https://portal-dev.cdp-int.defra.cloud']
        },
        {
          environment: 'test',
          urls: [
            'https://portal-test.cdp-int.defra.cloud',
            'https://portal-test-other.cdp-int.defra.cloud'
          ]
        }
      ])
    })
  })

  describe('With out a vanity url response', () => {
    beforeEach(async () => {
      nock(vanityUrlsEndpointUrl.origin)
        .get(vanityUrlsEndpointUrl.pathname)
        .reply(404, { message: 'Not Found' })

      result = await provideVanityUrls({
        params: { serviceId: 'cdp-portal-frontend' },
        logger: { debug: jest.fn() }
      })
    })

    test('Should provide null', () => {
      expect(result).toBeNull()
    })
  })
})
