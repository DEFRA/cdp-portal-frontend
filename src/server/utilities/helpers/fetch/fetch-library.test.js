import nock from 'nock'

import { config } from '~/src/config'
import { fetchLibrary } from '~/src/server/utilities/helpers/fetch/fetch-library'
import { libraryFixture } from '~/src/__fixtures__/library'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error'

describe('#fetchLibrary', () => {
  const libraryEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/libraries/cdp-node-frontend-library'
  )

  test('Should provide expected libraries response', async () => {
    nock(libraryEndpointUrl.origin)
      .get(libraryEndpointUrl.pathname)
      .reply(200, libraryFixture)

    const libraryResponse = await fetchLibrary('cdp-node-frontend-library')

    expect(libraryResponse).toEqual(libraryFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(libraryEndpointUrl.origin)
      .get(libraryEndpointUrl.pathname)
      .reply(402, { message: 'Crickey majicky!!!?!' })

    const error = await getError(async () =>
      fetchLibrary('cdp-node-frontend-library')
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Crickey majicky!!!?!')
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(libraryEndpointUrl.origin)
      .get(libraryEndpointUrl.pathname)
      .reply(411, {})

    const error = await getError(async () =>
      fetchLibrary('cdp-node-frontend-library')
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Length Required')
  })
})
