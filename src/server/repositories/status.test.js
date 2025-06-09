import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockEntityCall,
  mockRepositoryCall,
  mockRepositoryEntityStatusCall
} from '~/test-helpers/common-page-rendering.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { REPOSITORY } from '~/src/server/common/patterns/entities/tabs/constants.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')

describe('Repository Status page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  describe('Creating status', () => {
    beforeAll(async () => {
      jest.useFakeTimers({ advanceTimers: true })
      jest.setSystemTime(new Date('2025-05-10T14:16:00.000Z'))

      const repositoryName = 'mock-repository'
      const status = 'Creating'
      mockEntityCall(repositoryName, REPOSITORY, null, status)
      mockRepositoryEntityStatusCall(repositoryName, status)
      mockRepositoryCall(repositoryName, ['repository'])
      server = await initialiseServer()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      jest.useRealTimers()
    })

    test('logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/repositories/mock-repository/status',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/repositories/mock-repository/status',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user service owner', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/repositories/mock-repository/status',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged out', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/repositories/mock-repository/status',
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

      const repositoryName = 'mock-repository'
      const status = 'Created'
      mockEntityCall(repositoryName, REPOSITORY, null, status)
      mockRepositoryEntityStatusCall(repositoryName, status)
      mockRepositoryCall(repositoryName, ['repository'])
      server = await initialiseServer()
    })

    afterAll(async () => {
      await server.stop({ timeout: 0 })
      jest.useRealTimers()
    })

    test('logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/repositories/mock-repository/status',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/repositories/mock-repository/status',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged in tenant user service owner', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/repositories/mock-repository/status',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('logged out', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/repositories/mock-repository/status',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })
})
