import { statusCodes } from '@defra/cdp-validation-kit'

import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonTeamCalls,
  mockFetchCdpUserCall,
  mockFetchCdpTeamCall,
  mockFetchCdpTeamsCall
} from '../../../test-helpers/common-page-rendering.js'
import { cdpUserFixture } from '../../__fixtures__/admin/cdp-user.js'

vi.mock('./helpers/fetch/fetch-cdp-teams.js')
vi.mock('./helpers/fetch/fetchers.js')
vi.mock('../common/helpers/auth/get-user-session.js')
vi.mock('../common/helpers/fetch/fetch-entities.js')
vi.mock('../admin/users/helpers/fetch/fetchers.js')
vi.mock('../admin/teams/helpers/fetch/fetchers.js')

describe('Teams page', () => {
  let server

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('list view', () => {
    beforeAll(async () => {
      mockFetchCdpTeamsCall()
      server = await initialiseServer()
    })

    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams',
        isAdmin: true,
        isTenant: true,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams',
        isAdmin: false,
        isTenant: true,
        teamScope: 'fish-and-octopus'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged out user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })

  describe('team view', () => {
    beforeAll(async () => {
      mockFetchCdpTeamCall('platform')
      mockCommonTeamCalls()
      server = await initialiseServer()
    })

    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams/platform',
        isAdmin: true,
        isTenant: true,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in team member', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams/platform',
        isAdmin: false,
        isTenant: true,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in team member with canGrantBreakGlass', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams/platform',
        isAdmin: false,
        isTenant: true,
        teamScope: 'platform',
        additionalScopes: ['permission:canGrantBreakGlass:team:platform']
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams/platform',
        isAdmin: false,
        isTenant: true,
        teamScope: 'fish-and-octopus'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged out user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams/platform',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })

  describe('add team member view', () => {
    beforeAll(async () => {
      mockFetchCdpTeamCall('bees')
      server = await initialiseServer()
    })

    test('page renders for logged in team member', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams/bees/add-member',
        isAdmin: false,
        isTenant: true,
        teamScope: 'bees'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders forbidden for users without permission', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams/bees/add-member',
        isAdmin: false,
        isTenant: true,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page renders unauthorized for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/teams/platform/add-member',
        isAdmin: false,
        isTenant: false,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })

  describe('remove team member view', () => {
    beforeAll(async () => {
      mockFetchCdpTeamCall('bees')
      mockFetchCdpUserCall()
      server = await initialiseServer()
    })

    test('page renders for logged in team member', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/bees/remove-member/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'bees'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders forbidden for users without permission', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/bees/remove-member/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page renders unauthorized for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/bees/remove-member/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: false,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })

  describe('grant break glass view', () => {
    beforeAll(async () => {
      mockFetchCdpTeamCall('bees')
      mockFetchCdpUserCall()
      server = await initialiseServer()
    })

    test('page renders for logged in team member with canGrantBreakGlass', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/bees/grant-break-glass/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'bees',
        additionalScopes: ['permission:canGrantBreakGlass:team:bees']
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders forbidden for users without permission', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/platform/grant-break-glass/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page renders unauthorized for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/platform/grant-break-glass/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: false,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })

  describe('remove break glass view', () => {
    beforeAll(async () => {
      mockFetchCdpTeamCall('bees')
      mockFetchCdpUserCall()
      server = await initialiseServer()
    })

    test('page renders for logged in team member with canGrantBreakGlass', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/bees/remove-break-glass/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'bees',
        additionalScopes: ['permission:canGrantBreakGlass:team:bees']
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders forbidden for users without permission', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/platform/remove-break-glass/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page renders unauthorized for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/teams/platform/remove-break-glass/${cdpUserFixture.userId}`,
        isAdmin: false,
        isTenant: false,
        teamScope: 'platform'
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })
})
