import nock from 'nock'

import { config } from '~/src/config'
import { deployableImagesFixture } from '~/src/__fixtures__/deploy-service/deployable-images'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch-deployable-image-names'

describe('#fetchDeployableImageNames', () => {
  const deployableImagesEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/deployables'
  )

  test('Should provide expected deployable images response', async () => {
    nock(deployableImagesEndpointUrl.origin)
      .get(deployableImagesEndpointUrl.pathname)
      .reply(200, deployableImagesFixture)

    const deployableImageNames = await fetchDeployableImageNames()

    expect(deployableImageNames).toEqual(deployableImagesFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(deployableImagesEndpointUrl.origin)
      .get(deployableImagesEndpointUrl.pathname)
      .reply(401, { message: 'Sorry - that is not allowed!' })

    expect.assertions(2)

    try {
      await fetchDeployableImageNames()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Sorry - that is not allowed!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(deployableImagesEndpointUrl.origin)
      .get(deployableImagesEndpointUrl.pathname)
      .reply(431, {})

    expect.assertions(2)

    try {
      await fetchDeployableImageNames()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Request Header Fields Too Large')
    }
  })
})
