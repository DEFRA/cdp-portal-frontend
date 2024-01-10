import nock from 'nock'

import { config } from '~/src/config'
import { fetchLibrary } from '~/src/server/utilities/helpers/fetch/fetch-library'
import { libraryFixture } from '~/src/__fixtures__/library'

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

    expect.assertions(2)

    try {
      await fetchLibrary('cdp-node-frontend-library')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Crickey majicky!!!?!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(libraryEndpointUrl.origin)
      .get(libraryEndpointUrl.pathname)
      .reply(411, {})

    expect.assertions(2)

    try {
      await fetchLibrary('cdp-node-frontend-library')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Length Required')
    }
  })
})
