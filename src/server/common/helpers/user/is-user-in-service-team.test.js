import { cdpTeamsFixture } from '~/src/__fixtures__/admin/cdp-teams'
import { isUserInServiceTeam } from '~/src/server/common/helpers/user/is-user-in-service-team'

describe('#isUserInServiceTeam', () => {
  describe('When user is in a service team', () => {
    test('Should rbe marked as in a service team', async () => {
      const isServiceTeamUser = await isUserInServiceTeam(
        cdpTeamsFixture.teams,
        ['087d4a80-002b-48cf-a7d3-aa60b67784f0']
      )

      expect(isServiceTeamUser).toEqual(true)
    })
  })

  describe('When user is NOT in a service team', () => {
    test('Should rbe marked as in a service team', async () => {
      const isServiceTeamUser = await isUserInServiceTeam(
        cdpTeamsFixture.teams,
        ['012345678']
      )

      expect(isServiceTeamUser).toEqual(false)
    })
  })
})
