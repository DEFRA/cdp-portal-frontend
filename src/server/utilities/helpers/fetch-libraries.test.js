import nock from 'nock'

import { config } from '~/src/config'
import { librariesFixture } from '~/src/__fixtures__/libraries'
import { fetchLibraries } from '~/src/server/utilities/helpers/fetch-libraries'

describe('#fetchLibraries', () => {
  const librariesEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/libraries?team=cdp-platform'
  )

  test('Should provide expected libraries response', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(200, librariesFixture)

    const librariesResponse = await fetchLibraries()

    expect(librariesResponse).toEqual(librariesFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(407, { message: 'Woaaaaaaaaaaaaaaaah calm down!' })

    expect.assertions(2)

    try {
      await fetchLibraries()
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
      await fetchLibraries()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Gone')
    }
  })
})