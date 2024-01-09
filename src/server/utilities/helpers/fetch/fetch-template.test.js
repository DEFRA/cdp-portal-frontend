import nock from 'nock'

import { config } from '~/src/config'
import { fetchTemplate } from '~/src/server/utilities/helpers/fetch/fetch-template'
import { templateFixture } from '~/src/__fixtures__/template'

describe('#fetchTemplate', () => {
  const templateEndpointUrl = new URL(
    config.get('portalBackendApiUrl') + '/templates/cdp-portal-frontend'
  )

  test('Should provide expected template response', async () => {
    nock(templateEndpointUrl.origin)
      .get(templateEndpointUrl.pathname)
      .reply(200, templateFixture)

    const templateResponse = await fetchTemplate('cdp-portal-frontend')

    expect(templateResponse).toEqual(templateFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(templateEndpointUrl.origin)
      .get(templateEndpointUrl.pathname)
      .reply(407, { message: 'Total and utter disaster occurred!!!' })

    expect.assertions(2)

    try {
      await fetchTemplate('cdp-portal-frontend')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        'Total and utter disaster occurred!!!'
      )
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(templateEndpointUrl.origin)
      .get(templateEndpointUrl.pathname)
      .reply(505, {})

    expect.assertions(2)

    try {
      await fetchTemplate('cdp-portal-frontend')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'HTTP Version Not Supported')
    }
  })
})
