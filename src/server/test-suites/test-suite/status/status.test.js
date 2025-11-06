import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonTestSuiteCalls
} from '../../../../../test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit'

vi.mock('../../../common/helpers/fetch/fetch-repository.js')
vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')

describe('Test-Suite Status page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  describe('Creating status', () => {
    beforeAll(async () => {
      vi.useFakeTimers({ advanceTimers: true })
      vi.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      const repositoryName = 'mock-test-suite'
      const status = 'Creating'
      mockCommonTestSuiteCalls(repositoryName, status)
      server = await initialiseServer()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      vi.useRealTimers()
    })

    test('logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user test-suite owner', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged out', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })

  describe('Created status', () => {
    beforeAll(async () => {
      vi.useFakeTimers({ advanceTimers: true })
      vi.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      const repositoryName = 'mock-test-suite'
      const status = 'Created'
      mockCommonTestSuiteCalls(repositoryName, status)
      server = await initialiseServer()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      vi.useRealTimers()
    })

    test('logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/status',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/status',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user test-suite owner', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/status',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged out', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/status',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })
})
