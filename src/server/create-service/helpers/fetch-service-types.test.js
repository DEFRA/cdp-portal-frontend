import nock from 'nock'

import { config } from '~/src/config'
import { serviceTypesFixture } from '~/src/__fixtures__/service-types'
import { fetchServiceTypes } from '~/src/server/create-service/helpers/fetch-service-types'

describe('#fetchServiceTypes', () => {
  const serviceTypesEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/service-types'
  )

  test('Should provide expected fetch service types response', async () => {
    nock(serviceTypesEndpointUrl.origin)
      .get(serviceTypesEndpointUrl.pathname)
      .reply(200, serviceTypesFixture)

    const serviceTypes = await fetchServiceTypes()

    expect(serviceTypes).toEqual(serviceTypesFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(serviceTypesEndpointUrl.origin)
      .get(serviceTypesEndpointUrl.pathname)
      .reply(413, { message: 'Nope we cannot allow that!' })

    expect.assertions(2)

    try {
      await fetchServiceTypes()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Nope we cannot allow that!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(serviceTypesEndpointUrl.origin)
      .get(serviceTypesEndpointUrl.pathname)
      .reply(418, {})

    expect.assertions(2)

    try {
      await fetchServiceTypes()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', "I'm a teapot")
    }
  })
})
