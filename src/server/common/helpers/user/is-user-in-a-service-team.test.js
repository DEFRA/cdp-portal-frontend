import { cdpTeamsFixture } from '~/src/__fixtures__/admin/cdp-teams'
import { isUserInAServiceTeam } from '~/src/server/common/helpers/user/is-user-in-a-service-team'

describe('#isUserInAServiceTeam', () => {
  describe('When user is in a service team', () => {
    test('Should rbe marked as in a service team', async () => {
      const isServiceTeamUser = await isUserInAServiceTeam(
        cdpTeamsFixture.teams,
        ['087d4a80-002b-48cf-a7d3-aa60b67784f0']
      )

      expect(isServiceTeamUser).toEqual(true)
    })
  })

  describe('When user is NOT in a service team', () => {
    test('Should rbe marked as in a service team', async () => {
      const isServiceTeamUser = await isUserInAServiceTeam(
        cdpTeamsFixture.teams,
        ['012345678']
      )

      expect(isServiceTeamUser).toEqual(false)
    })
  })
})
