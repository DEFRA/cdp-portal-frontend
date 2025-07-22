import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall,
  mockServicesAdditionalCalls
} from '~/test-helpers/common-page-rendering.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { availableMigrationsFixture } from '~/src/__fixtures__/migrations/available-migrations.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-running-services.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-vanity-urls.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-shuttering-urls.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-api-gateways.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-available-migrations.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-latest-migrations.js')
jest.mock(
  '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
)

describe('Services', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  describe('About service page', () => {
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

  describe('About postgres service page', () => {
    const serviceName = 'mock-postgres-service'
    const additionalScopes = [scopes.restrictedTechPostgres]
    const availableChangelogVersions = availableMigrationsFixture()
    const applyChangelogButtons = availableChangelogVersions.map(
      (changelog) => `apply-button-${changelog.version}`
    )

    beforeAll(async () => {
      jest.useFakeTimers({ advanceTimers: true })
      jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      mockServiceEntityCall(serviceName, 'backend')
      mockServicesAdditionalCalls({
        repositoryName: serviceName,
        frontendOrBackend: 'backend',
        isPostgresService: true
      })
      server = await initialiseServer()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      jest.useRealTimers()
    })

    test('logged in admin user restrictedTechPostgres permission', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}`,
        isAdmin: true,
        isTenant: true,
        additionalScopes
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()

      // Database details section is present for a postgres service
      expect(result).toContain('data-testid="database-details"')

      // Database Changelogs "apply" buttons are present
      applyChangelogButtons.forEach((buttonTestId) => {
        expect(result).toContain(`data-testid="${buttonTestId}"`)
      })
    })

    test('logged in tenant user restrictedTechPostgres permission', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}`,
        isAdmin: false,
        isTenant: true,
        additionalScopes
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()

      // Database details section is present for a postgres service
      expect(result).toContain('data-testid="database-details"')

      // Database Changelogs "apply" buttons are not present
      applyChangelogButtons.forEach((buttonTestId) => {
        expect(result).not.toContain(`data-testid="${buttonTestId}"`)
      })
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}`,
        isAdmin: false,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()

      // Database details section is present for a postgres service
      expect(result).toContain('data-testid="database-details"')

      // Database Changelogs "apply" buttons are not present
      applyChangelogButtons.forEach((buttonTestId) => {
        expect(result).not.toContain(`data-testid="${buttonTestId}"`)
      })
    })

    test('logged out user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}`,
        isAdmin: false,
        isTenant: false
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()

      // Database details section is present for a postgres service
      expect(result).toContain('data-testid="database-details"')

      // Database Changelogs "apply" buttons are not present
      applyChangelogButtons.forEach((buttonTestId) => {
        expect(result).not.toContain(`data-testid="${buttonTestId}"`)
      })
    })
  })

  describe('About prototype service page', () => {
    const serviceName = 'mock-prototype'

    beforeAll(async () => {
      jest.useFakeTimers({ advanceTimers: true })
      jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      mockServiceEntityCall(serviceName, 'frontend', 'Created', 'Prototype')
      mockServicesAdditionalCalls({
        repositoryName: serviceName
      })
      server = await initialiseServer()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      jest.useRealTimers()
    })

    test('logged in admin user restrictedTechPostgres permission', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}`,
        isAdmin: true,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user restrictedTechPostgres permission', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}`,
        isAdmin: false,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}`,
        isAdmin: false,
        isTenant: true
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged out user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}`,
        isAdmin: false,
        isTenant: false
      })

      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })
})
