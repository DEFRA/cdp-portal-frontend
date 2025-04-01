import nock from 'nock'

import { config } from '~/src/config/config.js'
import { fetchLatestDeploymentSettings } from '~/src/server/common/helpers/fetch/fetch-latest-deployment-settings.js'
import { existingServiceInfoFixture } from '~/src/__fixtures__/deploy-service/existing-service-info.js'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error.js'

describe('#fetchLatestDeploymentSettings', () => {
  const environment = 'infra-dev'
  const imageName = 'cdp-portal-frontend'
  const existingServiceInfoEndpoint = new URL(
    config.get('portalBackendUrl') +
      `/deployment-settings/${imageName}/${environment}`
  )

  test('Should provide expected fetch cdp user response', async () => {
    nock(existingServiceInfoEndpoint.origin)
      .get(existingServiceInfoEndpoint.pathname)
      .reply(200, existingServiceInfoFixture)

    const serviceInfo = await fetchLatestDeploymentSettings(
      environment,
      imageName
    )

    expect(serviceInfo).toEqual(existingServiceInfoFixture)
  })

  test('When user does not exists, Should throw with expected message', async () => {
    nock(existingServiceInfoEndpoint.origin)
      .get(existingServiceInfoEndpoint.pathname)
      .reply(404, {})

    const serviceInfo = await fetchLatestDeploymentSettings(
      environment,
      imageName
    )

    expect(serviceInfo).toBeNull()
  })

  test('With error, Should throw with expected message', async () => {
    nock(existingServiceInfoEndpoint.origin)
      .get(existingServiceInfoEndpoint.pathname)
      .replyWithError('Legally we cannot allow that!')

    const error = await getError(async () =>
      fetchLatestDeploymentSettings(environment, imageName)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty(
      'message',
      'Client request error: Legally we cannot allow that!'
    )
  })
})
