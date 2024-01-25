import nock from 'nock'

import { config } from '~/src/config'
import { deployableImagesFixture } from '~/src/__fixtures__/deploy-service/deployable-images'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names'
import { fetchWithAuth } from '~/src/server/common/helpers/auth/fetch-with-auth'

describe('#fetchDeployableImageNames', () => {
  const mockRequest = {
    getUserSession: jest.fn().mockResolvedValue({ scope: ['group1'] }),
    fetchWithAuth: fetchWithAuth({
      getUserSession: jest.fn().mockResolvedValue({})
    })
  }
  const deployableImagesEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/deployables'
  )

  test('Should provide expected deployable images response', async () => {
    nock(deployableImagesEndpointUrl.origin)
      .get(deployableImagesEndpointUrl.pathname)
      .query({ type: 'service', groups: 'group1' })
      .reply(200, deployableImagesFixture)

    const deployableImageNames = await fetchDeployableImageNames(mockRequest)

    expect(deployableImageNames).toEqual(deployableImagesFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(deployableImagesEndpointUrl.origin)
      .get(deployableImagesEndpointUrl.pathname)
      .query({ type: 'service', groups: 'group1' })
      .reply(404, { message: 'Sorry - that is not allowed!' })

    expect.assertions(2)

    try {
      await fetchDeployableImageNames(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Sorry - that is not allowed!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(deployableImagesEndpointUrl.origin)
      .get(deployableImagesEndpointUrl.pathname)
      .query({ type: 'service', groups: 'group1' })
      .reply(431, {})

    expect.assertions(2)

    try {
      await fetchDeployableImageNames(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Request Header Fields Too Large')
    }
  })
})
