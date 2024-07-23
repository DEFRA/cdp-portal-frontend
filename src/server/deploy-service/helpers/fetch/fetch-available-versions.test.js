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
      .reply(200, [{ tag: '0.0.0' }, ...availableVersionsFixture])

    const availableVersions = await fetchAvailableVersions(serviceName)

    expect(availableVersions).toEqual(availableVersionsFixture)
  })

  test('With error, Should return empty array', async () => {
    nock(deployablesVersionsEndpoint.origin)
      .get(deployablesVersionsEndpoint.pathname)
      .reply(423, { message: 'Arghhhhhhhhhhhhhh!' })

    const response = await fetchAvailableVersions(serviceName)

    expect(response).toEqual([])
  })
})
