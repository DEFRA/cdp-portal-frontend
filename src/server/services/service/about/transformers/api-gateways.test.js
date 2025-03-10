import nock from 'nock'

import { config } from '~/src/config/config.js'
import { apiGatewaysFixture } from '~/src/__fixtures__/api-gateways.js'
import { provideApiGateways } from '~/src/server/services/service/about/transformers/api-gateways.js'

describe('#provideApiGateways', () => {
  const serviceName = 'cdp-portal-backend'
  const apiGatewaysEndpoint =
    config.get('portalBackendUrl') + `/api-gateways/${serviceName}`
  const apiGatewaysEndpointUrl = new URL(apiGatewaysEndpoint)
  let result

  describe('With backend url response', () => {
    beforeEach(async () => {
      nock(apiGatewaysEndpointUrl.origin)
        .get(apiGatewaysEndpointUrl.pathname)
        .reply(200, apiGatewaysFixture)

      result = await provideApiGateways({
        params: { serviceId: 'cdp-portal-backend' },
        logger: { debug: jest.fn() }
      })
    })

    test('Should provide expected available versions', () => {
      expect(result).toEqual([
        {
          environment: 'infra-dev',
          apis: [
            {
              api: 'portal-test.cdp-int.defra.cloud',
              environment: 'infra-dev',
              serviceName: 'cdp-portal-backend',
              shuttered: false
            }
          ]
        },
        {
          environment: 'management',
          apis: [
            {
              api: 'portal.cdp-int.defra.cloud',
              environment: 'management',
              serviceName: 'cdp-portal-backend',
              shuttered: false
            }
          ]
        },
        {
          environment: 'dev',
          apis: [
            {
              api: 'portal-dev.cdp-int.defra.cloud',
              environment: 'dev',
              serviceName: 'cdp-portal-backend',
              shuttered: false
            }
          ]
        },
        {
          environment: 'test',
          apis: [
            {
              api: 'portal-test.cdp-int.defra.cloud',
              environment: 'test',
              serviceName: 'cdp-portal-backend',
              shuttered: false
            },
            {
              api: "portal-test-other.cdp-int.defra.cloud'",
              environment: 'test',
              serviceName: 'cdp-portal-backend',
              shuttered: false
            }
          ]
        }
      ])
    })
  })

  describe('With out a api gateway response', () => {
    beforeEach(async () => {
      nock(apiGatewaysEndpointUrl.origin)
        .get(apiGatewaysEndpointUrl.pathname)
        .reply(404, { message: 'Not Found' })

      result = await provideApiGateways({
        params: { serviceId: 'cdp-portal-backend' },
        logger: { debug: jest.fn() }
      })
    })

    test('Should provide null', () => {
      expect(result).toBeNull()
    })
  })
})
