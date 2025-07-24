import { describe, expect, test, vi } from 'vitest'
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
        '087d4a80-002b-48cf-a7d3-aa60b67784f0',
        '6ed0400a-a8a0-482b-b45a-109634cd1274',
        '9e068bb9-1452-426e-a4ca-2e675a942a89',
        'aabe63e7-87ef-4beb-a596-c810631fc474'
      ])
    })
  })

  describe('With service team user', () => {
    test('Should receive only teams they are in, in response', async () => {
      const mockRequest = {
        getUserSession: vi.fn().mockResolvedValue({
          scope: [
            '9e068bb9-1452-426e-a4ca-2e675a942a89',
            '087d4a80-002b-48cf-a7d3-aa60b67784f0'
          ]
        })
      }

      nock(teamsEndpointUrl.origin)
        .get(teamsEndpointUrl.pathname)
        .query({ hasGithub: true })
        .reply(200, cdpTeamsFixture)

      const usersTeams = await getUsersTeams(mockRequest)
      const usersTeamsIds = usersTeams.map((team) => team.teamId)

      expect(usersTeamsIds).toEqual([
        '9e068bb9-1452-426e-a4ca-2e675a942a89',
        '087d4a80-002b-48cf-a7d3-aa60b67784f0'
      ])
    })
  })
})
