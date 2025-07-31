import nock from 'nock'

import { config } from '../../../../config/config.js'
import { librariesFixture } from '../../../../__fixtures__/libraries.js'
import { fetchJson } from './fetch-json.js'
import {
  getError,
  NoErrorThrownError
} from '../../../../../test-helpers/get-error.js'

describe('#fetcher', () => {
  const librariesEndpoint = config.get('portalBackendUrl') + '/libraries'
  const librariesEndpointUrl = new URL(librariesEndpoint)

  test('Should provide expected libraries response', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(200, librariesFixture)

    const { payload: librariesResponse } = await fetchJson(librariesEndpoint)

    expect(librariesResponse).toEqual(librariesFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .replyWithError('Woaaaaaaaaaaaaaaaah calm down!')

    const error = await getError(async () => fetchJson(librariesEndpoint))

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty(
      'message',
      'Client request error: Woaaaaaaaaaaaaaaaah calm down!'
    )
  })

  test('With generic error, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .replyWithError(
        new Error(
          'invalid json response body at http://bad-url reason: Unexpected end of JSON input'
        )
      )

    await expect(fetchJson(librariesEndpoint)).rejects.toThrow(
      'Client request error'
    )
  })
})
