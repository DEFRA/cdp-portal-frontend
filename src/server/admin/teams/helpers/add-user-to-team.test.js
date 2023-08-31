import nock from 'nock'

import { appConfig } from '~/src/config'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { addUserToTeam } from '~/src/server/admin/teams/helpers/add-user-to-team'

describe('#addUserToTeam', () => {
  const teamId = '47c04343-4c0e-4326-9848-bef7c1e2eedd'
  const userId = '1398fa86-98a2-4ee8-84bb-2468cc71d0ec'
  const addUserToTeamEndpointUrl = new URL(
    appConfig.get('userServiceApiUrl') + `/teams/${teamId}/add/${userId}`
  )

  test('Should provide expected add user to team response', async () => {
    nock(addUserToTeamEndpointUrl.origin)
      .patch(addUserToTeamEndpointUrl.pathname)
      .reply(200, cdpTeamFixture)

    const cdpTeam = await addUserToTeam(teamId, userId)

    expect(cdpTeam).toEqual(cdpTeamFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(addUserToTeamEndpointUrl.origin)
      .patch(addUserToTeamEndpointUrl.pathname)
      .reply(504, { message: 'Wowzers!!!' })

    expect.assertions(2)

    try {
      await addUserToTeam(teamId, userId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Wowzers!!!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(addUserToTeamEndpointUrl.origin)
      .patch(addUserToTeamEndpointUrl.pathname)
      .reply(401, {})

    expect.assertions(2)

    try {
      await addUserToTeam(teamId, userId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Unauthorized')
    }
  })
})
