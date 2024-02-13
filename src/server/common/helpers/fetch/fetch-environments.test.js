import nock from 'nock'

import { config } from '~/src/config'
import { authedFetcher } from '~/src/server/common/helpers/fetch/authed-fetcher'
import { environmentsFixture } from '~/src/__fixtures__/environments'
import { fetchEnvironments } from '~/src/server/common/helpers/fetch/fetch-environments'

describe('#fetchEnvironments', () => {
  const mockRequest = {
    authedFetcher: authedFetcher({
      getUserSession: jest.fn().mockResolvedValue({})
    })
  }
  const environmentsEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/environments'
  )

  test('Should provide expected environments response', async () => {
    nock(environmentsEndpointUrl.origin)
      .get(environmentsEndpointUrl.pathname)
      .reply(200, environmentsFixture)

    const environmentNames = await fetchEnvironments(mockRequest)

    expect(environmentNames).toEqual(environmentsFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(environmentsEndpointUrl.origin)
      .get(environmentsEndpointUrl.pathname)
      .reply(404, { message: 'Sorry - that is not allowed!' })

    expect.assertions(2)

    try {
      await fetchEnvironments(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Sorry - that is not allowed!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(environmentsEndpointUrl.origin)
      .get(environmentsEndpointUrl.pathname)
      .reply(431, {})

    expect.assertions(2)

    try {
      await fetchEnvironments(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Request Header Fields Too Large')
    }
  })
})
