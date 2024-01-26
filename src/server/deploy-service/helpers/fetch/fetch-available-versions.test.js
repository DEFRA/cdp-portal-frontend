import nock from 'nock'

import { config } from '~/src/config'
import { availableVersionsFixture } from '~/src/__fixtures__/available-versions'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions'

describe('#fetchAvailableVersions', () => {
  const serviceName = 'cdp-portal-frontend'
  const deployablesVersionsEndpoint = new URL(
    config.get('portalBackendApiUrl') + `/deployables/${serviceName}`
  )

  test('Should provide expected available options response', async () => {
    nock(deployablesVersionsEndpoint.origin)
      .get(deployablesVersionsEndpoint.pathname)
      .reply(200, availableVersionsFixture)

    const availableVersions = await fetchAvailableVersions(serviceName)

    expect(availableVersions).toEqual(availableVersionsFixture)
  })

  test('Should filter out zero version', async () => {
    nock(deployablesVersionsEndpoint.origin)
      .get(deployablesVersionsEndpoint.pathname)
      .reply(200, ['0.0.0', ...availableVersionsFixture])

    const availableVersions = await fetchAvailableVersions(serviceName)

    expect(availableVersions).toEqual(availableVersionsFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(deployablesVersionsEndpoint.origin)
      .get(deployablesVersionsEndpoint.pathname)
      .reply(423, { message: 'Arghhhhhhhhhhhhhh!' })

    expect.assertions(2)

    try {
      await fetchAvailableVersions(serviceName)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Arghhhhhhhhhhhhhh!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(deployablesVersionsEndpoint.origin)
      .get(deployablesVersionsEndpoint.pathname)
      .reply(417, {})

    expect.assertions(2)

    try {
      await fetchAvailableVersions(serviceName)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Expectation Failed')
    }
  })
})
