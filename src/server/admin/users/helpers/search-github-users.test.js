import nock from 'nock'

import { appConfig } from '~/src/config'
import { gitHubUsersFixture } from '~/src/__fixtures__/admin/github-users'
import { searchGitHubUsers } from '~/src/server/admin/users/helpers/search-github-users'

describe('#searchGitHubUsers', () => {
  const query = 'Vibert'
  const searchGitHubUsersEndpointUrl = new URL(
    appConfig.get('userServiceApiUrl') + `/github-users?query=${query}`
  )

  test('Should provide expected search GitHub users response', async () => {
    const mockGitHubUserSearchResponse = {
      ...gitHubUsersFixture,
      users: gitHubUsersFixture.users.filter((user) =>
        user.github.includes(query)
      )
    }

    nock(searchGitHubUsersEndpointUrl.origin)
      .get(searchGitHubUsersEndpointUrl.pathname)
      .query({ query })
      .reply(200, mockGitHubUserSearchResponse)

    const gitHubUsers = await searchGitHubUsers(query)

    expect(gitHubUsers).toEqual(mockGitHubUserSearchResponse)
  })

  test('With error, Should throw with expected message', async () => {
    nock(searchGitHubUsersEndpointUrl.origin)
      .get(searchGitHubUsersEndpointUrl.pathname)
      .query({ query })
      .reply(502, { message: 'Bloomin heck!' })

    expect.assertions(2)

    try {
      await searchGitHubUsers(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Bloomin heck!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(searchGitHubUsersEndpointUrl.origin)
      .get(searchGitHubUsersEndpointUrl.pathname)
      .query({ query })
      .reply(410, {})
    expect.assertions(2)

    try {
      await searchGitHubUsers(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Gone')
    }
  })
})
