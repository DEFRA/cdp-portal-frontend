import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall,
  mockServiceEntityStatusCall,
  mockServicesAdditionalCalls
} from '~/test-helpers/common-page-rendering.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-running-services.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-vanity-urls.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-api-gateways.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-available-migrations.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-latest-migrations.js')
jest.mock(
  '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
)

// TODO remove skip once the service creation page is fully implemented
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Services', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  describe('Creating service page', () => {
    beforeAll(async () => {
      jest.useFakeTimers({ advanceTimers: true })
      jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      mockServiceEntityCall('mock-service', 'frontend', 'Creating')
      mockServiceEntityStatusCall('mock-service', 'Creating')
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

    test('logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user service owner', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged out', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })
})
