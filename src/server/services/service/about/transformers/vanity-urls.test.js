import nock from 'nock'

import { config } from '../../../../../config/config.js'
import { vanityUrlsFixture } from '../../../../../__fixtures__/vanity-urls.js'
import { provideVanityUrls } from './vanity-urls.js'

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
        logger: { debug: vi.fn() }
      })
    })

    test('Should provide expected available versions', () => {
      expect(result).toEqual([
        {
          environment: 'infra-dev',
          urls: [
            {
              url: 'portal-test.cdp-int.defra.cloud',
              environment: 'infra-dev',
              serviceName: 'cdp-portal-frontend',
              enabled: false,
              shuttered: false
            }
          ]
        },
        {
          environment: 'management',
          urls: [
            {
              url: 'portal.cdp-int.defra.cloud',
              environment: 'management',
              serviceName: 'cdp-portal-frontend',
              enabled: false,
              shuttered: false
            }
          ]
        },
        {
          environment: 'dev',
          urls: [
            {
              url: 'portal-dev.cdp-int.defra.cloud',
              environment: 'dev',
              serviceName: 'cdp-portal-frontend',
              enabled: false,
              shuttered: false
            }
          ]
        },
        {
          environment: 'test',
          urls: [
            {
              url: 'portal-test.cdp-int.defra.cloud',
              environment: 'test',
              serviceName: 'cdp-portal-frontend',
              enabled: false,
              shuttered: false
            },
            {
              url: "portal-test-other.cdp-int.defra.cloud'",
              environment: 'test',
              serviceName: 'cdp-portal-frontend',
              enabled: false,
              shuttered: false
            }
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
        logger: { debug: vi.fn() }
      })
    })

    test('Should provide null', () => {
      expect(result).toBeNull()
    })
  })
})
