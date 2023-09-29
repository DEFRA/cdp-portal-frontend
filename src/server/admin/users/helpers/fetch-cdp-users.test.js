import nock from 'nock'

import { config } from '~/src/config'
import { fetchCdpUsers } from '~/src/server/admin/users/helpers/fetch-cdp-users'
import { cdpUsersFixture } from '~/src/__fixtures__/admin/cdp-users'

describe('#fetchCdpUsers', () => {
  const usersEndpointUrl = new URL(config.get('userServiceApiUrl') + '/users')

  test('Should provide expected cdp users response', async () => {
    nock(usersEndpointUrl.origin)
      .get(usersEndpointUrl.pathname)
      .reply(200, cdpUsersFixture)

    const cdpUsers = await fetchCdpUsers()

    expect(cdpUsers).toEqual(cdpUsersFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(usersEndpointUrl.origin)
      .get(usersEndpointUrl.pathname)
      .reply(421, { message: 'No no no!' })

    expect.assertions(2)

    try {
      await fetchCdpUsers()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'No no no!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(usersEndpointUrl.origin).get(usersEndpointUrl.pathname).reply(417, {})

    expect.assertions(2)

    try {
      await fetchCdpUsers()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Expectation Failed')
    }
  })
})
