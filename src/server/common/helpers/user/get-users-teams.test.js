import nock from 'nock'

import { config } from '../../../../config/config.js'
import { cdpTeamsFixture } from '../../../../__fixtures__/admin/cdp-teams.js'
import { getUsersTeams } from './get-users-teams.js'

describe('#getUsersTeams', () => {
  const teamsEndpointUrl = new URL(
    config.get('userServiceBackendUrl') + '/teams'
  )

  describe('With Admin user', () => {
    test('Should receive all teams in response', async () => {
      const mockRequest = {
        getUserSession: vi.fn().mockResolvedValue({
          isAdmin: true
        })
      }

      nock(teamsEndpointUrl.origin)
        .get(teamsEndpointUrl.pathname)
        .query({ hasGithub: true })
        .reply(200, cdpTeamsFixture)

      const usersTeams = await getUsersTeams(mockRequest)
      const usersTeamsIds = usersTeams.map((team) => team.teamId)

      expect(usersTeamsIds).toEqual([
        'fish-and-octopus',
        'trees-and-forests',
        'bees',
        'platform'
      ])
    })
  })

  describe('With service team user', () => {
    test('Should receive only teams they are in, in response', async () => {
      const mockRequest = {
        getUserSession: vi.fn().mockResolvedValue({
          scope: ['team:bees', 'team:fish-and-octopus']
        })
      }

      nock(teamsEndpointUrl.origin)
        .get(teamsEndpointUrl.pathname)
        .query({ hasGithub: true })
        .reply(200, cdpTeamsFixture)

      const usersTeams = await getUsersTeams(mockRequest)
      const usersTeamsIds = usersTeams.map((team) => team.teamId)

      expect(usersTeamsIds).toEqual(['bees', 'fish-and-octopus'])
    })
  })
})
