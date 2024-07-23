import nock from 'nock'

import { config } from '~/src/config'
import { deploymentsFixture } from '~/src/__fixtures__/deployments'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch/fetch-deployment'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#fetchDeployment', () => {
  const deploymentId = '553E4E6B-05D7-4A2E-BF80-02ED34DEF864'
  const deploymentEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + `/v2/deployments/${deploymentId}`
  )

  test('Should provide expected deployment response', async () => {
    nock(deploymentEndpointUrl.origin)
      .get(deploymentEndpointUrl.pathname)
      .reply(200, deploymentsFixture.data.at(0))

    const deployment = await fetchDeployment(deploymentId)

    expect(deployment).toEqual(deploymentsFixture.data.at(0))
  })

  test('When deployment does not exists, Should throw with expected message', async () => {
    nock(deploymentEndpointUrl.origin)
      .get(deploymentEndpointUrl.pathname)
      .reply(404, {})

    const error = await getError(async () => fetchDeployment(deploymentId))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Not Found')
  })

  test('With error, Should throw with expected message', async () => {
    nock(deploymentEndpointUrl.origin)
      .get(deploymentEndpointUrl.pathname)
      .reply(503, { message: 'Wooooooah Wooooooah Wooooooah!' })

    const response = await fetchDeployment(deploymentId)

    expect(response).toEqual({})
  })
})
