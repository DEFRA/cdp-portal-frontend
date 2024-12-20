import nock from 'nock'

import { config } from '~/src/config/config.js'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team.js'
import { removeMemberFromTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { authedFetcherDecorator } from '~/src/server/common/helpers/fetch/authed-fetcher.js'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error.js'

describe('#removeUserFromTeam', () => {
  const teamId = '47c04343-4c0e-4326-9848-bef7c1e2eedd'
  const userId = '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
  const removeUserFromTeamEndpointUrl = new URL(
    config.get('userServiceBackendUrl') + `/teams/${teamId}/remove/${userId}`
  )
  const mockRequest = {
    authedFetcher: authedFetcherDecorator({
      getUserSession: jest.fn().mockResolvedValue({}),
      logger: {
        error: jest.fn(),
        debug: jest.fn()
      }
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

    const error = await getError(async () =>
      removeMemberFromTeam(mockRequest, teamId, userId)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Ouch!')
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(removeUserFromTeamEndpointUrl.origin)
      .patch(removeUserFromTeamEndpointUrl.pathname)
      .reply(407, {})

    const error = await getError(async () =>
      removeMemberFromTeam(mockRequest, teamId, userId)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Proxy Authentication Required')
  })
})
