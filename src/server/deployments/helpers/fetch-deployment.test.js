import nock from 'nock'

import { appConfig } from '~/src/config'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch-deployment'

describe('#fetchDeployment', () => {
  const deploymentId = '553E4E6B-05D7-4A2E-BF80-02ED34DEF864'
  const deploymentEndpointUrl = new URL(
    appConfig.get('portalBackendApiUrl') + `/deployments/${deploymentId}`
  )

  test('Should provide expected deployment response', async () => {
    nock(deploymentEndpointUrl.origin)
      .get(deploymentEndpointUrl.pathname)
      .reply(200, deploymentsFixture.at(0))

    const deployment = await fetchDeployment(deploymentId)

    expect(deployment).toEqual(deploymentsFixture.at(0))
  })

  test('When deployment does not exists, Should throw with expected message', async () => {
    nock(deploymentEndpointUrl.origin)
      .get(deploymentEndpointUrl.pathname)
      .reply(404, {})

    expect.assertions(2)

    try {
      await fetchDeployment(deploymentId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Not Found')
    }
  })

  test('With error, Should throw with expected message', async () => {
    nock(deploymentEndpointUrl.origin)
      .get(deploymentEndpointUrl.pathname)
      .reply(503, { message: 'Wooooooah Wooooooah Wooooooah!' })

    expect.assertions(2)

    try {
      await fetchDeployment(deploymentId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Wooooooah Wooooooah Wooooooah!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(deploymentEndpointUrl.origin)
      .get(deploymentEndpointUrl.pathname)
      .reply(426, {})

    expect.assertions(2)

    try {
      await fetchDeployment(deploymentId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Upgrade Required')
    }
  })
})
