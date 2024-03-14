import nock from 'nock'

import { config } from '~/src/config'
import { fetchExistingServiceInfo } from '~/src/server/deploy-service/helpers/fetch/fetch-existing-service-info'
import { existingServiceInfoFixture } from '~/src/__fixtures__/deploy-service/existing-service-info'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#fetchExistingServiceInfo', () => {
  const environment = 'infra-dev'
  const imageName = 'cdp-portal-frontend'
  const existingServiceInfoEndpoint = new URL(
    config.get('portalBackendApiUrl') +
      `/deployment-config/${imageName}/${environment}`
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
      .reply(407, { message: 'Legally we cannot allow that!' })

    const error = await getError(async () =>
      fetchExistingServiceInfo(environment, imageName)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Legally we cannot allow that!')
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(existingServiceInfoEndpoint.origin)
      .get(existingServiceInfoEndpoint.pathname)
      .reply(429, {})

    const error = await getError(async () =>
      fetchExistingServiceInfo(environment, imageName)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Too Many Requests')
  })
})
