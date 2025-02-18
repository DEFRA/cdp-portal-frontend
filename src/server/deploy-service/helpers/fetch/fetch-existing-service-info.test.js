import nock from 'nock'

import { config } from '~/src/config/config.js'
import { fetchExistingServiceInfo } from '~/src/server/deploy-service/helpers/fetch/fetch-existing-service-info.js'
import { existingServiceInfoFixture } from '~/src/__fixtures__/deploy-service/existing-service-info.js'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error.js'

describe('#fetchExistingServiceInfo', () => {
  const environment = 'infra-dev'
  const imageName = 'cdp-portal-frontend'
  const existingServiceInfoEndpoint = new URL(
    config.get('portalBackendUrl') +
      `/v2/deployment-config/${imageName}/${environment}`
  )

  test('Should provide expected fetch cdp user response', async () => {
    nock(existingServiceInfoEndpoint.origin)
      .get(existingServiceInfoEndpoint.pathname)
      .reply(200, existingServiceInfoFixture)

    const serviceInfo = await fetchExistingServiceInfo(environment, imageName)

    expect(serviceInfo).toEqual(existingServiceInfoFixture)
  })

  test('When user does not exists, Should throw with expected message', async () => {
    nock(existingServiceInfoEndpoint.origin)
      .get(existingServiceInfoEndpoint.pathname)
      .reply(404, {})

    const serviceInfo = await fetchExistingServiceInfo(environment, imageName)

    expect(serviceInfo).toBeNull()
  })

  test('With error, Should throw with expected message', async () => {
    nock(existingServiceInfoEndpoint.origin)
      .get(existingServiceInfoEndpoint.pathname)
      .replyWithError('Legally we cannot allow that!')

    const error = await getError(async () =>
      fetchExistingServiceInfo(environment, imageName)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty(
      'message',
      'Client request error: Legally we cannot allow that!'
    )
  })
})
