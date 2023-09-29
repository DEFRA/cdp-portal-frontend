import nock from 'nock'

import { config } from '~/src/config'
import { cdpTeamsFixture } from '~/src/__fixtures__/admin/cdp-teams'
import { fetchCdpTeams } from '~/src/server/admin/teams/helpers/fetch-cdp-teams'

describe('#fetchCdpTeams', () => {
  const teamsEndpointUrl = new URL(config.get('userServiceApiUrl') + '/teams')

  test('Should provide expected cdp teams response', async () => {
    nock(teamsEndpointUrl.origin)
      .get(teamsEndpointUrl.pathname)
      .reply(200, cdpTeamsFixture)

    const cdpTeams = await fetchCdpTeams()

    expect(cdpTeams).toEqual(cdpTeamsFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(teamsEndpointUrl.origin)
      .get(teamsEndpointUrl.pathname)
      .reply(501, { message: 'Crikey?!?' })

    expect.assertions(2)

    try {
      await fetchCdpTeams()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Crikey?!?')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(teamsEndpointUrl.origin).get(teamsEndpointUrl.pathname).reply(406, {})

    expect.assertions(2)

    try {
      await fetchCdpTeams()
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Not Acceptable')
    }
  })
})
