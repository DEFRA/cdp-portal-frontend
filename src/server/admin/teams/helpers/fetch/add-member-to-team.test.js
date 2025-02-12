import nock from 'nock'

import { config } from '~/src/config/config.js'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team.js'
import { addMemberToTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { authedFetchJsonDecorator } from '~/src/server/common/helpers/fetch/authed-fetch-json.js'
import { getError, NoErrorThrownError } from '~/test-helpers/get-error.js'

describe('#addUserToTeam', () => {
  const teamId = '47c04343-4c0e-4326-9848-bef7c1e2eedd'
  const userId = '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
  const addUserToTeamEndpointUrl = new URL(
    config.get('userServiceBackendUrl') + `/teams/${teamId}/add/${userId}`
  )
  const mockRequest = {
    authedFetchJson: authedFetchJsonDecorator({
      getUserSession: jest.fn().mockResolvedValue({}),
      logger: {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn()
      }
    })
  }

  test('Should provide expected add user to team response', async () => {
    nock(addUserToTeamEndpointUrl.origin)
      .patch(addUserToTeamEndpointUrl.pathname)
      .reply(200, cdpTeamFixture)

    const cdpTeam = await addMemberToTeam(mockRequest, teamId, userId)

    expect(cdpTeam).toEqual(cdpTeamFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(addUserToTeamEndpointUrl.origin)
      .patch(addUserToTeamEndpointUrl.pathname)
      .replyWithError('Wowzers!!!')

    const error = await getError(async () =>
      addMemberToTeam(mockRequest, teamId, userId)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Client request error: Wowzers!!!')
  })
})
