import nock from 'nock'

import { config } from '~/src/config/config.js'
import { deployableImagesFixture } from '~/src/__fixtures__/deploy-service/deployable-images.js'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names.js'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error.js'

describe('#fetchDeployableImageNames', () => {
  const mockRequest = {
    logger: {
      info: jest.fn()
    },
    getUserSession: jest.fn().mockResolvedValue({ scope: ['group1'] })
  }
  const deployableImagesEndpointUrl = new URL(
    config.get('portalBackendUrl') + '/deployables'
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
        .replyWithError('Sorry - that is not allowed!')

      const error = await getError(async () =>
        fetchDeployableImageNames({ scope: ['group1'] })
      )

      expect(error).not.toBeInstanceOf(NoErrorThrownError)
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Client request error: Sorry - that is not allowed!'
      )
    })
  })
})
