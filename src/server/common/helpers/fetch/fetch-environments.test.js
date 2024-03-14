import nock from 'nock'

import { config } from '~/src/config'
import { authedFetcher } from '~/src/server/common/helpers/fetch/authed-fetcher'
import { environmentsFixture } from '~/src/__fixtures__/environments'
import { fetchEnvironments } from '~/src/server/common/helpers/fetch/fetch-environments'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#fetchEnvironments', () => {
  const mockRequest = {
    authedFetcher: authedFetcher({
      getUserSession: jest.fn().mockResolvedValue({}),
      logger: {
        error: jest.fn()
      }
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

    const error = await getError(async () => fetchEnvironments(mockRequest))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Sorry - that is not allowed!')
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(environmentsEndpointUrl.origin)
      .get(environmentsEndpointUrl.pathname)
      .reply(431, {})

    const error = await getError(async () => fetchEnvironments(mockRequest))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Request Header Fields Too Large')
  })
})
