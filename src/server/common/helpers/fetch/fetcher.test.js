import nock from 'nock'

import { config } from '~/src/config'
import { librariesFixture } from '~/src/__fixtures__/libraries'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'

describe('#fetchJson', () => {
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

    expect.assertions(2)

    try {
      await fetcher(librariesEndpoint)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Woaaaaaaaaaaaaaaaah calm down!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(410, {})

    expect.assertions(2)

    try {
      await fetcher(librariesEndpoint)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Gone')
    }
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

    expect.assertions(2)

    try {
      await fetcher(librariesEndpoint)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'request to http://localhost:5094/cdp-portal-backend/libraries failed, reason: invalid json response body at' +
          ' http://bad-url reason: Unexpected end of JSON input'
      )
    }
  })
})
