import nock from 'nock'

import { config } from '~/src/config'
import { deployableImagesFixture } from '~/src/__fixtures__/deploy-service/deployable-images'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#fetchDeployableImageNames', () => {
  const mockRequest = {
    logger: {
      info: jest.fn()
    },
    getUserSession: jest.fn().mockResolvedValue({ scope: ['group1'] })
  }
  const deployableImagesEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/deployables'
  )

  describe('With a request argument', () => {
    test('Should provide expected deployable images response', async () => {
      nock(deployableImagesEndpointUrl.origin)
        .get(deployableImagesEndpointUrl.pathname)
        .query({ runMode: 'service', groups: 'group1' })
        .reply(200, deployableImagesFixture)

      const deployableImageNames = await fetchDeployableImageNames({
        request: mockRequest
      })

      expect(deployableImageNames).toEqual(deployableImagesFixture)
    })

    test('With error, Should throw with expected message', async () => {
      nock(deployableImagesEndpointUrl.origin)
        .get(deployableImagesEndpointUrl.pathname)
        .query({ runMode: 'service', groups: 'group1' })
        .reply(404, { message: 'Sorry - that is not allowed!' })

      const error = await getError(async () =>
        fetchDeployableImageNames({
          request: mockRequest
        })
      )

      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Sorry - that is not allowed!')
    })

    test('With different status code, Should throw with expected message', async () => {
      nock(deployableImagesEndpointUrl.origin)
        .get(deployableImagesEndpointUrl.pathname)
        .query({ runMode: 'service', groups: 'group1' })
        .reply(431, {})

      const error = await getError(async () =>
        fetchDeployableImageNames({
          request: mockRequest
        })
      )

      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Request Header Fields Too Large')
    })
  })

  describe('With a scope argument', () => {
    test('Should provide expected deployable images response', async () => {
      nock(deployableImagesEndpointUrl.origin)
        .get(deployableImagesEndpointUrl.pathname)
        .query({ runMode: 'service', groups: 'group1' })
        .reply(200, deployableImagesFixture)

      const deployableImageNames = await fetchDeployableImageNames({
        scope: ['group1']
      })

      expect(deployableImageNames).toEqual(deployableImagesFixture)
    })

    test('With error, Should throw with expected message', async () => {
      nock(deployableImagesEndpointUrl.origin)
        .get(deployableImagesEndpointUrl.pathname)
        .query({ runMode: 'service', groups: 'group1' })
        .reply(403, { message: 'Sorry - that is not allowed!' })

      const error = await getError(async () =>
        fetchDeployableImageNames({ scope: ['group1'] })
      )

      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Sorry - that is not allowed!')
    })

    test('With different status code, Should throw with expected message', async () => {
      nock(deployableImagesEndpointUrl.origin)
        .get(deployableImagesEndpointUrl.pathname)
        .query({ runMode: 'service', groups: 'group1' })
        .reply(431, {})

      const error = await getError(async () =>
        fetchDeployableImageNames({ scope: ['group1'] })
      )

      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Request Header Fields Too Large')
    })
  })
})
