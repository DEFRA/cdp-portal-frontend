import nock from 'nock'

import { appConfig } from '~/src/config'
import { azureActiveDirectoryUsersFixture } from '~/src/__fixtures__/admin/azure-active-directory-users'
import { searchAzureActiveDirectoryUsers } from '~/src/server/admin/users/helpers/search-azure-active-directory-users'

describe('#searchAadUsers', () => {
  const query = 'Mira'
  const searchAadUsersEndpointUrl = new URL(
    appConfig.get('userServiceApiUrl') +
      `/aad-users${query ? '?query=' + query : ''}`
  )

  test('Should provide expected search azure active directory users response', async () => {
    const mockAadUserSearchResponse = {
      ...azureActiveDirectoryUsersFixture,
      users: azureActiveDirectoryUsersFixture.users.filter((user) =>
        user.name.includes(query)
      )
    }

    nock(searchAadUsersEndpointUrl.origin)
      .get(searchAadUsersEndpointUrl.pathname)
      .query({ query })
      .reply(200, mockAadUserSearchResponse)

    const aadUsers = await searchAzureActiveDirectoryUsers(query)

    expect(aadUsers).toEqual(mockAadUserSearchResponse)
  })

  test('With error, Should throw with expected message', async () => {
    nock(searchAadUsersEndpointUrl.origin)
      .get(searchAadUsersEndpointUrl.pathname)
      .query({ query })
      .reply(504, { message: 'Hells bells!' })

    expect.assertions(2)

    try {
      await searchAzureActiveDirectoryUsers(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Hells bells!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(searchAadUsersEndpointUrl.origin)
      .get(searchAadUsersEndpointUrl.pathname)
      .query({ query })
      .reply(414, {})
    expect.assertions(2)

    try {
      await searchAzureActiveDirectoryUsers(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Request-URI Too Large')
    }
  })
})
