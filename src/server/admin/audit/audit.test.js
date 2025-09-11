import { statusCodes } from '@defra/cdp-validation-kit'

import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '../../../../test-helpers/common-page-rendering.js'
import { fetchAudit } from '../../common/helpers/fetch/fetch-audit.js'

vi.mock('../../common/helpers/fetch/fetch-audit.js')
vi.mock('../../common/helpers/auth/get-user-session.js')

describe('Audit page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    fetchAudit.mockResolvedValue([
      {
        category: 'breakGlass',
        action: 'Granted',
        performedBy: {
          id: '90552794-0613-4023-819a-512aa9d40023',
          displayName: 'Admin User'
        },
        performedAt: '2025-09-10T12:30:40.512Z',
        details: {
          user: {
            userId: 'dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48',
            displayName: 'Non-Admin User'
          },
          team: {
            teamId: 'platform',
            name: 'Platform'
          },
          startDate: '2025-09-10T12:30:40.512Z',
          endDate: '2025-09-10T14:30:40.512Z',
          reason:
            'broken service that needs investigating and fixing outside of normal processes'
        }
      },
      {
        category: 'breakGlass',
        action: 'TerminalAccess',
        performedBy: {
          id: 'dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48',
          displayName: 'Non-Admin User'
        },
        performedAt: '2025-09-10T12:31:18.855Z',
        details: {
          environment: 'prod',
          service: 'cdp-portal-backend'
        }
      },
      {
        category: 'breakGlass',
        action: 'TerminalAccess',
        performedBy: {
          id: 'dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48',
          displayName: 'Non-Admin User'
        },
        performedAt: '2025-09-10T12:31:35.166Z',
        details: {
          environment: 'prod',
          service: 'cdp-postgres-service'
        }
      },
      {
        category: 'breakGlass',
        action: 'Removed',
        performedBy: {
          id: '90552794-0613-4023-819a-512aa9d40023',
          displayName: 'Admin User'
        },
        performedAt: '2025-09-10T12:32:35.933Z',
        details: {
          user: {
            email: 'non-admin.user@oidc.mock',
            github: 'nonadminuser',
            name: 'Non-Admin User',
            createdAt: '2024-11-11T13:51:00.028Z',
            scopes: [
              {
                scopeId: '674def9d30093e3a3aa49d35',
                scopeName: 'externalTest'
              },
              {
                scopeId: '6824a65285c4bfd4d458ab74',
                scopeName: 'admin'
              }
            ],
            updatedAt: '2025-09-10T12:32:35.924Z',
            teams: [
              {
                teamId: 'platform',
                name: 'Platform'
              },
              {
                teamId: 'tenantteam1',
                name: 'TenantTeam1'
              }
            ],
            hasBreakGlass: false,
            userId: 'dfa791eb-76b2-434c-ad1f-bb9dc1dd8b48'
          },
          team: {
            teamId: 'platform',
            name: 'Platform'
          },
          endDate: '2025-09-10T12:32:35.933Z'
        }
      }
    ])
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('list view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/audit',
        isAdmin: true,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page errors for logged in non-service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/audit',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/admin/audit',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })
})
