import nock from 'nock'

import { config } from '~/src/config'
import { cdpUserFixture } from '~/src/__fixtures__/admin/cdp-user'
import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch-cdp-user'

describe('#fetchCdpUser', () => {
  const userId = '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
  const userEndpointUrl = new URL(
    config.get('userServiceApiUrl') + `/users/${userId}`
  )

  test('Should provide expected fetch cdp user response', async () => {
    nock(userEndpointUrl.origin)
      .get(userEndpointUrl.pathname)
      .reply(200, cdpUserFixture)

    const cdpUser = await fetchCdpUser(userId)

    expect(cdpUser).toEqual(cdpUserFixture)
  })

  test('When user does not exists, Should throw with expected message', async () => {
    nock(userEndpointUrl.origin).get(userEndpointUrl.pathname).reply(404, {})

    expect.assertions(2)

    try {
      await fetchCdpUser(userId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Not Found')
    }
  })

  test('With error, Should throw with expected message', async () => {
    nock(userEndpointUrl.origin)
      .get(userEndpointUrl.pathname)
      .reply(451, { message: 'Nope we cannot allow that!' })

    expect.assertions(2)

    try {
      await fetchCdpUser(userId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Nope we cannot allow that!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(userEndpointUrl.origin).get(userEndpointUrl.pathname).reply(428, {})

    expect.assertions(2)

    try {
      await fetchCdpUser(userId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Precondition Required')
    }
  })
})
