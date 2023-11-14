import nock from 'nock'

import { config } from '~/src/config'
import { cdpTeamsFixture } from '~/src/__fixtures__/admin/cdp-teams'
import { isUserInServiceTeam } from '~/src/server/common/helpers/user/is-user-in-service-team'

describe('#isUserInServiceTeam', () => {
  const teamsEndpointUrl = new URL(config.get('userServiceApiUrl') + '/teams')

  beforeEach(() => {
    nock(teamsEndpointUrl.origin)
      .get(teamsEndpointUrl.pathname)
      .query({ hasGithub: true })
      .reply(200, cdpTeamsFixture)
  })

  describe('When user is in a service team', () => {
    test('Should rbe marked as in a service team', async () => {
      const isServiceTeamUser = await isUserInServiceTeam([
        '087d4a80-002b-48cf-a7d3-aa60b67784f0'
      ])

      expect(isServiceTeamUser).toEqual(true)
    })
  })

  describe('When user is NOT in a service team', () => {
    test('Should rbe marked as in a service team', async () => {
      const isServiceTeamUser = await isUserInServiceTeam(['012345678'])

      expect(isServiceTeamUser).toEqual(false)
    })
  })
})
