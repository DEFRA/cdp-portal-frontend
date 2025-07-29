import nock from 'nock'

import { config } from '../../../../../config/config.js'
import { cdpTeamFixture } from '../../../../../__fixtures__/admin/cdp-team.js'
import { removeMemberFromTeam } from './index.js'
import { authedFetchJsonDecorator } from '../../../../common/helpers/fetch/authed-fetch-json.js'
import {
  getError,
  NoErrorThrownError
} from '../../../../../../test-helpers/get-error.js'

describe('#removeUserFromTeam', () => {
  const teamId = '47c04343-4c0e-4326-9848-bef7c1e2eedd'
  const userId = '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
  const removeUserFromTeamEndpointUrl = new URL(
    config.get('userServiceBackendUrl') + `/teams/${teamId}/remove/${userId}`
  )
  const mockRequest = {
    authedFetchJson: authedFetchJsonDecorator({
      getUserSession: vi.fn().mockResolvedValue({}),
      logger: {
        error: vi.fn(),
        debug: vi.fn()
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
      .replyWithError('Ouch!')

    const error = await getError(async () =>
      removeMemberFromTeam(mockRequest, teamId, userId)
    )

    expect(error).not.toBeInstanceOf(NoErrorThrownError)
    expect(error).toBeInstanceOf(Error)
    expect(error).toHaveProperty('message', 'Client request error: Ouch!')
  })
})
