import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall,
  mockServicesAdditionalCalls
} from '~/test-helpers/common-page-rendering.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-running-services.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-shuttering-urls.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-api-gateways.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')

describe('Services', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  describe('Maintenance service page', () => {
    beforeAll(async () => {
      jest.useFakeTimers({ advanceTimers: true })
      jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      mockServiceEntityCall('mock-service', 'frontend')
      mockServicesAdditionalCalls({
        repositoryName: 'mock-service',
        frontendOrBackend: 'frontend'
      })
      server = await initialiseServer()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      jest.useRealTimers()
    })

    test('logged in admin user with scope', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/maintenance',
        isAdmin: true,
        isTenant: true,
        additionalScopes: [scopes.restrictedTechMaintenance]
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
        teamScope: 'mock-team-id',
        additionalScopes: [scopes.restrictedTechMaintenance]
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
