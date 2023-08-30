import nock from 'nock'

import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch-cdp-team'
import { appConfig } from '~/src/config'
import { adminTeamFixture } from '~/src/__fixtures__/admin/team'

describe('#fetchCdpTeam', () => {
  const teamId = '47c04343-4c0e-4326-9848-bef7c1e2eedd'
  const teamEndpointUrl = new URL(
    appConfig.get('userServiceApiUrl') + `/teams/${teamId}`
  )

  test('Should provide expected response', async () => {
    nock(teamEndpointUrl.origin)
      .get(teamEndpointUrl.pathname)
      .reply(200, adminTeamFixture)

    const cdpTeam = await fetchCdpTeam(teamId)

    expect(cdpTeam).toEqual(adminTeamFixture)
  })

  test('When team does not exists, Should throw with expected message', async () => {
    nock(teamEndpointUrl.origin).get(teamEndpointUrl.pathname).reply(404, {})

    expect.assertions(2)

    try {
      await fetchCdpTeam(teamId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Not Found')
    }
  })
})
