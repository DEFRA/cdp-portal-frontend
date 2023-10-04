import nock from 'nock'

import { config } from '~/src/config'
import { githubTeamsFixture } from '~/src/__fixtures__/admin/github-teams'
import { searchGithubTeams } from '~/src/server/admin/teams/helpers/search-github-teams'

describe('#searchGithubTeams', () => {
  const query = 'platform'
  const searchGithubTeamsEndpointUrl = new URL(
    config.get('userServiceApiUrl') + `/github-teams?query=${query}`
  )

  test('Should provide expected search github teams response', async () => {
    const mockGithubTeamsSearchResponse = {
      ...githubTeamsFixture,
      teams: githubTeamsFixture.teams.filter((team) =>
        team.github.includes(query)
      )
    }

    nock(searchGithubTeamsEndpointUrl.origin)
      .get(searchGithubTeamsEndpointUrl.pathname)
      .query({ query })
      .reply(200, mockGithubTeamsSearchResponse)

    const githubTeams = await searchGithubTeams(query)

    expect(githubTeams).toEqual(mockGithubTeamsSearchResponse)
  })

  test('With error, Should throw with expected message', async () => {
    nock(searchGithubTeamsEndpointUrl.origin)
      .get(searchGithubTeamsEndpointUrl.pathname)
      .query({ query })
      .reply(508, { message: 'Oh my goodness!' })

    expect.assertions(2)

    try {
      await searchGithubTeams(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Oh my goodness!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(searchGithubTeamsEndpointUrl.origin)
      .get(searchGithubTeamsEndpointUrl.pathname)
      .query({ query })
      .reply(415, {})
    expect.assertions(2)

    try {
      await searchGithubTeams(query)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Unsupported Media Type')
    }
  })
})
