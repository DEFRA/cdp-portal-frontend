import nock from 'nock'

import { config } from '~/src/config'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch/fetch-deploy-service-options'
import { deployServiceOptionsFixture } from '~/src/__fixtures__/deploy-service/deploy-service-options'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#fetchDeployServiceOptions', () => {
  const deployServiceOptionsEndpoint = new URL(
    config.get('selfServiceOpsApiUrl') + '/deploy-service/options'
  )

  test('Should provide expected deploy service options response', async () => {
    nock(deployServiceOptionsEndpoint.origin)
      .get(deployServiceOptionsEndpoint.pathname)
      .reply(200, deployServiceOptionsFixture)

    const deployableImageNames = await fetchDeployServiceOptions()

    expect(deployableImageNames).toEqual(deployServiceOptionsFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(deployServiceOptionsEndpoint.origin)
      .get(deployServiceOptionsEndpoint.pathname)
      .reply(401, { message: 'Huston we have a problem!' })

    const error = await getError(fetchDeployServiceOptions)

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Huston we have a problem!')
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(deployServiceOptionsEndpoint.origin)
      .get(deployServiceOptionsEndpoint.pathname)
      .reply(402, {})

    const error = await getError(fetchDeployServiceOptions)

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Payment Required')
  })
})
