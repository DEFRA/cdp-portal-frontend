import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall
} from '~/test-helpers/common-page-rendering.js'
import { fetchAllSecrets } from '~/src/server/services/helpers/fetch/fetch-all-secrets.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-all-secrets.js')

describe('Service Secrets page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    fetchAllSecrets.mockResolvedValue({
      'infra-dev': {
        keys: ['SOME_KEY'],
        lastChangedDate: '2024-11-15T16:03:38.3139986Z',
        createdDate: null
      },
      dev: {
        keys: ['SOME_KEY'],
        lastChangedDate: '2024-11-15T16:03:38.3139986Z',
        createdDate: null
      }
    })

    mockServiceEntityCall('mock-service-with-secrets', 'backend')
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('all envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors for logged in non-service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(403)
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(401)
    })
  })

  describe('single envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets/infra-dev',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors for logged in non-service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets/dev',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(403)
      expect(result).toMatchFile()
    })

    test('admin only env page errors for logged in tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets/infra-dev',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(403)
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets/prod',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('admin only env page errors for logged in service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets/management',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(404)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-secrets/secrets/management',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(401)
    })
  })
})
