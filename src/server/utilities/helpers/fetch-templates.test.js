import nock from 'nock'

import { config } from '~/src/config'
import { templatesFixture } from '~/src/__fixtures__/templates'
import { fetchTemplates } from '~/src/server/utilities/helpers/fetch-templates'

describe('#fetchTemplates', () => {
  const templatesEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/templates?team=cdp-platform'
  )

  test('Should provide expected libraries response', async () => {
    nock(templatesEndpointUrl.origin)
      .get(templatesEndpointUrl.pathname)
      .reply(200, templatesFixture)

    const librariesResponse = await fetchTemplates()

    expect(librariesResponse).toEqual(templatesFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(templatesEndpointUrl.origin)
      .get(templatesEndpointUrl.pathname)
      .reply(400, { message: 'Catastrophic disaster occurred!!!' })

    expect.assertions(2)

    try {
      await fetchTemplates()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Catastrophic disaster occurred!!!'
      )
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(templatesEndpointUrl.origin)
      .get(templatesEndpointUrl.pathname)
      .reply(504, {})

    expect.assertions(2)

    try {
      await fetchTemplates()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Gateway Time-out')
    }
  })
})
