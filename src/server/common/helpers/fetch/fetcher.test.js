import nock from 'nock'

import { config } from '~/src/config'
import { librariesFixture } from '~/src/__fixtures__/libraries'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#fetcher', () => {
  const librariesEndpoint = config.get('portalBackendApiUrl') + '/libraries'
  const librariesEndpointUrl = new URL(librariesEndpoint)

  test('Should provide expected libraries response', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(200, librariesFixture)

    const { json: librariesResponse } = await fetcher(librariesEndpoint)

    expect(librariesResponse).toEqual(librariesFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(407, { message: 'Woaaaaaaaaaaaaaaaah calm down!' })

    const error = await getError(async () => fetcher(librariesEndpoint))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Woaaaaaaaaaaaaaaaah calm down!')
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(410, {})

    const error = await getError(async () => fetcher(librariesEndpoint))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Gone')
  })

  test('With generic error, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .replyWithError({
        message:
          'invalid json response body at http://bad-url reason: Unexpected end of JSON input',
        type: 'invalid-json',
        stack:
          'FetchError: invalid json response body at http://bad-url reason: Unexpected end of JSON input'
      })

    const error = await getError(async () => fetcher(librariesEndpoint))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty(
      'message',
      'request to http://localhost:5094/libraries failed, reason: invalid json response body at' +
        ' http://bad-url reason: Unexpected end of JSON input'
    )
  })
})
