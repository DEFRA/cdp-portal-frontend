import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall,
  mockServicesAdditionalCalls
} from '#test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit'
import { fetchShutteringUrls } from '../../helpers/fetch/fetch-shuttering-urls.js'

vi.mock('../../../common/helpers/fetch/fetch-running-services.js')
vi.mock('../../helpers/fetch/fetch-shuttering-urls.js')
vi.mock('../../helpers/fetch/fetch-api-gateways.js')
vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')

describe('Services', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  describe('Maintenance service page', () => {
    beforeAll(async () => {
      mockServiceEntityCall('mock-service', 'frontend')
      mockServicesAdditionalCalls({
        repositoryName: 'mock-service',
        frontendOrBackend: 'frontend'
      })
      server = await initialiseServer()

      vi.useFakeTimers({ advanceTimers: true })
      vi.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      vi.useRealTimers()
    })

    test('logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/maintenance',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/maintenance',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.forbidden)
      expect(result).toMatchFile()
    })

    test('logged in tenant user service owner with scope', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/maintenance',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged out', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/maintenance',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
      expect(result).toMatchFile()
    })

    test('shows timed out shutter request mismatch message', async () => {
      fetchShutteringUrls.mockResolvedValueOnce([
        {
          environment: 'prod',
          serviceName: 'mock-service',
          url: 'portal.defra.gov',
          waf: 'external_public',
          internal: false,
          status: 'Active',
          requestedShuttered: true,
          lastActionedBy: {
            id: '00000000-0000-0000-0000-000000000001',
            displayName: 'B. A. Baracus'
          },
          lastActionedAt: '2025-05-10T13:45:00.000Z',
          delegated: true
        }
      ])

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/maintenance',
        isAdmin: true,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })
})
