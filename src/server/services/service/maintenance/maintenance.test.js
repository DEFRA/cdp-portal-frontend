import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall,
  mockServicesAdditionalCalls
} from '../../../../../test-helpers/common-page-rendering.js'
import { statusCodes } from '../../../common/constants/status-codes.js'

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
      vi.useFakeTimers({ advanceTimers: true })
      vi.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      mockServiceEntityCall('mock-service', 'frontend')
      mockServicesAdditionalCalls({
        repositoryName: 'mock-service',
        frontendOrBackend: 'frontend'
      })
      server = await initialiseServer()
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
  })
})
