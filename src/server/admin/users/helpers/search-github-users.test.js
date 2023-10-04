import nock from 'nock'

import { config } from '~/src/config'
import { githubUsersFixture } from '~/src/__fixtures__/admin/github-users'
import { searchGithubUsers } from '~/src/server/admin/users/helpers/search-github-users'

describe('#searchGithubUsers', () => {
  const query = 'Vibert'
  const searchGithubUsersEndpointUrl = new URL(
    config.get('userServiceApiUrl') + `/github-users?query=${query}`
  )

  test('Should provide expected search Github users response', async () => {
    const mockGithubUserSearchResponse = {
      ...githubUsersFixture,
      users: githubUsersFixture.users.filter((user) =>
        user.github.includes(query)
      )
    }

    nock(searchGithubUsersEndpointUrl.origin)
      .get(searchGithubUsersEndpointUrl.pathname)
      .query({ query })
      .reply(200, mockGithubUserSearchResponse)

    const githubUsers = await searchGithubUsers(query)

    expect(githubUsers).toEqual(mockGithubUserSearchResponse)
  })

  test('With error, Should throw with expected message', async () => {
    nock(searchGithubUsersEndpointUrl.origin)
      .get(searchGithubUsersEndpointUrl.pathname)
      .query({ query })
      .reply(502, { message: 'Bloomin heck!' })

    expect.assertions(2)

    try {
      await searchGithubUsers(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Bloomin heck!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(searchGithubUsersEndpointUrl.origin)
      .get(searchGithubUsersEndpointUrl.pathname)
      .query({ query })
      .reply(410, {})
    expect.assertions(2)

    try {
      await searchGithubUsers(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Gone')
    }
  })
})
