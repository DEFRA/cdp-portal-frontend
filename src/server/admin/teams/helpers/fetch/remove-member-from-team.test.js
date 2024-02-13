import nock from 'nock'

import { config } from '~/src/config'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { removeMemberFromTeam } from '~/src/server/admin/teams/helpers/fetch'
import { authedFetcher } from '~/src/server/common/helpers/fetch/authed-fetcher'

describe('#removeUserFromTeam', () => {
  const teamId = '47c04343-4c0e-4326-9848-bef7c1e2eedd'
  const userId = '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
  const removeUserFromTeamEndpointUrl = new URL(
    config.get('userServiceApiUrl') + `/teams/${teamId}/remove/${userId}`
  )
  const mockRequest = {
    authedFetcher: authedFetcher({
      getUserSession: jest.fn().mockResolvedValue({})
    })
  }

  test('Should provide expected remove user from team response', async () => {
    nock(removeUserFromTeamEndpointUrl.origin)
      .patch(removeUserFromTeamEndpointUrl.pathname)
      .reply(200, cdpTeamFixture)

    const cdpTeam = await removeMemberFromTeam(mockRequest, teamId, userId)

    expect(cdpTeam).toEqual(cdpTeamFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(removeUserFromTeamEndpointUrl.origin)
      .patch(removeUserFromTeamEndpointUrl.pathname)
      .reply(509, { message: 'Ouch!' })

    expect.assertions(2)

    try {
      await removeMemberFromTeam(mockRequest, teamId, userId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Ouch!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(removeUserFromTeamEndpointUrl.origin)
      .patch(removeUserFromTeamEndpointUrl.pathname)
      .reply(407, {})

    expect.assertions(2)

    try {
      await removeMemberFromTeam(mockRequest, teamId, userId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Proxy Authentication Required')
    }
  })
})