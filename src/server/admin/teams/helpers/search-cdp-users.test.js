import nock from 'nock'

import { appConfig } from '~/src/config'
import { searchCdpUsers } from '~/src/server/admin/teams/helpers/search-cdp-users'
import { cdpUsersFixture } from '~/src/__fixtures__/admin/cdp-users'

describe('#searchCdpUsers', () => {
  const query = 'Richard'
  const searchUsersEndpointUrl = new URL(
    appConfig.get('userServiceApiUrl') + `/users?query=${query}`
  )

  test('Should provide expected search cdp users response', async () => {
    const mockUserSearchResponse = {
      ...cdpUsersFixture,
      users: cdpUsersFixture.users.filter((user) => user.name.includes(query))
    }

    nock(searchUsersEndpointUrl.origin)
      .get(searchUsersEndpointUrl.pathname)
      .query({ query })
      .reply(200, mockUserSearchResponse)

    const cdpUsers = await searchCdpUsers(query)

    expect(cdpUsers).toEqual(mockUserSearchResponse)
  })

  test('With error, Should throw with expected message', async () => {
    nock(searchUsersEndpointUrl.origin)
      .get(searchUsersEndpointUrl.pathname)
      .query({ query })
      .reply(506, { message: 'Oh my word!' })

    expect.assertions(2)

    try {
      await searchCdpUsers(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Oh my word!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(searchUsersEndpointUrl.origin)
      .get(searchUsersEndpointUrl.pathname)
      .query({ query })
      .reply(418, {})
    expect.assertions(2)

    try {
      await searchCdpUsers(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', "I'm a teapot")
    }
  })
})
