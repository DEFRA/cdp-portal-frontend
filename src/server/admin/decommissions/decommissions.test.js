import { randomUUID } from 'node:crypto'
import { statusCodes } from '@defra/cdp-validation-kit'

import { entityServicesFixture } from '../../../__fixtures__/services/entities.js'
import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '../../../../test-helpers/common-page-rendering.js'
import {
  fetchFeatureToggles,
  isFeatureToggleActiveForPath
} from '../features/helpers/fetch-feature-toggles.js'
import {
  fetchDecommissions,
  fetchEntities,
  fetchEntity
} from '../../common/helpers/fetch/fetch-entities.js'

vi.mock('../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../common/helpers/auth/get-user-session.js')
vi.mock('../features/helpers/fetch-feature-toggles.js')

describe('Decommissions pages', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    fetchDecommissions.mockResolvedValue([
      {
        name: 'cdp-portal-backend',
        type: 'Microservice',
        subType: 'Backend',
        primaryLanguage: 'JavaScript',
        created: '2016-12-05T11:21:25Z',
        teams: [
          {
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
            name: 'Platform'
          }
        ],
        status: 'Decommissioned',
        tags: ['live', 'beta'],
        decommissioned: {
          decommissionedBy: {
            id: randomUUID(),
            displayName: 'test-user'
          },
          started: '2024-01-01T00:00:00Z'
        }
      },
      {
        name: 'cdp-portal-frontend',
        type: 'Microservice',
        subType: 'Frontend',
        primaryLanguage: 'JavaScript',
        created: '2016-12-05T11:21:25Z',
        teams: [
          {
            teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
            name: 'Platform'
          }
        ],
        status: 'Decommissioning',
        tags: ['live'],
        decommissioned: {
          decommissionedBy: {
            id: randomUUID(),
            displayName: 'test-user-2'
          },
          started: '2024-01-02T00:00:00Z'
        }
      }
    ])
    fetchEntities.mockResolvedValue(entityServicesFixture)
    fetchEntity.mockResolvedValue(entityServicesFixture[0])
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('list view', () => {
    test('page renders for logged in admin user without feature toggle', async () => {
      fetchFeatureToggles.mockResolvedValue([])

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions',
        isAdmin: true,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in admin user with feature toggle active as only applies to start page', async () => {
      fetchFeatureToggles.mockResolvedValue([
        {
          id: 'disable-decommission',
          name: 'Disable decommission',
          url: '/admin/decommissions/start',
          active: true
        }
      ])

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page errors for logged in non-service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })

  describe('start decommission view', () => {
    test('page renders regular view for logged in admin user without feature toggle', async () => {
      isFeatureToggleActiveForPath.mockResolvedValue(false)

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions/start',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('unavailable view renders for logged in admin user with feature toggle active', async () => {
      isFeatureToggleActiveForPath.mockResolvedValue(true)

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions/start',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.serviceUnavailable)
      expect(result).toMatchFile()
    })

    test('page errors for logged in non-service owner tenant', async () => {
      isFeatureToggleActiveForPath.mockResolvedValue(true)
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions/start',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page errors with 401 for logged out user', async () => {
      isFeatureToggleActiveForPath.mockResolvedValue(true)
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions/start',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })

  describe('confirm decommission view', () => {
    test('page renders regular view for logged in admin user without feature toggle', async () => {
      isFeatureToggleActiveForPath.mockResolvedValue(false)

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions/cdp-portal-backend/confirm',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('unavailable view renders for logged in admin user with feature toggle active', async () => {
      isFeatureToggleActiveForPath.mockResolvedValue(true)

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions/cdp-portal-backend/confirm',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.serviceUnavailable)
      expect(result).toMatchFile()
    })

    test('page errors for logged in non-service owner tenant', async () => {
      isFeatureToggleActiveForPath.mockResolvedValue(true)
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions/cdp-portal-backend/confirm',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page errors with 401 for logged out user', async () => {
      isFeatureToggleActiveForPath.mockResolvedValue(true)
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/decommissions/cdp-portal-backend/confirm',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })
})
