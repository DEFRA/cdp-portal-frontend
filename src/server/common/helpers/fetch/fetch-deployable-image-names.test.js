import nock from 'nock'

import { config } from '../../../../config/config.js'
import { entityServicesFixture } from '../../../../__fixtures__/services/entities.js'
import { fetchDeployableImageNames } from './fetch-deployable-image-names.js'

describe('#fetchDeployableImageNames', () => {
  const deployableImagesEndpointUrl = new URL(
    config.get('portalBackendUrl') + '/entities'
  )

  describe('With a request argument', () => {
    const mockRequest = {
      logger: {
        info: vi.fn()
      },
      getUserSession: vi
        .fn()
        .mockResolvedValue({ scope: ['aabe63e7-87ef-4beb-a596-c810631fc474'] })
    }

    test('Should provide expected deployable images response', async () => {
      nock(deployableImagesEndpointUrl.origin)
        .get(deployableImagesEndpointUrl.pathname)
        .query({
          teamIds: 'aabe63e7-87ef-4beb-a596-c810631fc474',
          type: ['Microservice', 'Prototype'],
          status: ['Created', 'Creating']
        })
        .reply(200, entityServicesFixture)

      const deployableImageNames = await fetchDeployableImageNames({
        request: mockRequest
      })

      expect(deployableImageNames).toEqual([
        'cdp-portal-backend',
        'cdp-portal-frontend',
        'cdp-user-service-backend',
        'cdp-portal-stubs',
        'forms-service',
        'forms-designer',
        'ai-service',
        'cdp-example-node-postgres-be'
      ])
    })
  })

  describe('With admin user', () => {
    const mockRequest = {
      logger: {
        info: vi.fn()
      },
      getUserSession: vi.fn().mockResolvedValue({
        isAdmin: true,
        scopes: ['admin']
      })
    }

    test('Should provide expected deployable images response', async () => {
      nock(deployableImagesEndpointUrl.origin)
        .get(deployableImagesEndpointUrl.pathname)
        .query({
          type: ['Microservice', 'Prototype'],
          status: ['Created', 'Creating']
        })
        .reply(200, entityServicesFixture)

      const deployableImageNames = await fetchDeployableImageNames({
        request: mockRequest
      })

      expect(deployableImageNames).toEqual(
        entityServicesFixture.map((e) => e.name)
      )
    })
  })
})
