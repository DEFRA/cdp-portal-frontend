import nock from 'nock'

import { fetchCdpTeam } from '~/src/server/admin/teams/helpers/fetch-cdp-team'
import { config } from '~/src/config'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'

describe('#fetchCdpTeam', () => {
  const teamId = '47c04343-4c0e-4326-9848-bef7c1e2eedd'
  const teamEndpointUrl = new URL(
    config.get('userServiceApiUrl') + `/teams/${teamId}`
  )

  test('Should provide expected fetch cdp team response', async () => {
    nock(teamEndpointUrl.origin)
      .get(teamEndpointUrl.pathname)
      .reply(200, cdpTeamFixture)

    const cdpTeam = await fetchCdpTeam(teamId)

    expect(cdpTeam).toEqual(cdpTeamFixture)
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

  test('With error, Should throw with expected message', async () => {
    nock(teamEndpointUrl.origin)
      .get(teamEndpointUrl.pathname)
      .reply(500, { message: 'Wooooooah!' })

    expect.assertions(2)

    try {
      await fetchCdpTeam(teamId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Wooooooah!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(teamEndpointUrl.origin).get(teamEndpointUrl.pathname).reply(409, {})

    expect.assertions(2)

    try {
      await fetchCdpTeam(teamId)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Conflict')
    }
  })
})
