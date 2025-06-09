import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockRepositoryCall,
  mockServiceEntityCall,
  mockServiceEntityStatusCall
} from '~/test-helpers/common-page-rendering.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')

describe('Service Status page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  describe('Creating status', () => {
    beforeAll(async () => {
      jest.useFakeTimers({ advanceTimers: true })
      jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      const repositoryName = 'mock-service'
      const status = 'Creating'
      mockServiceEntityCall(repositoryName, 'frontend', status)
      mockServiceEntityStatusCall(repositoryName, 'frontend', status)
      mockRepositoryCall(repositoryName, ['frontend'])
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

  describe('Created status', () => {
    beforeAll(async () => {
      jest.useFakeTimers({ advanceTimers: true })
      jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      const repositoryName = 'mock-service'
      const status = 'Created'
      mockServiceEntityCall(repositoryName, 'frontend', status)
      mockServiceEntityStatusCall(repositoryName, 'frontend', status)
      mockRepositoryCall(repositoryName, ['frontend'])
      server = await initialiseServer()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      jest.useRealTimers()
    })

    test('logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/status',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/status',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user service owner', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/status',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged out', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service/status',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })
})
