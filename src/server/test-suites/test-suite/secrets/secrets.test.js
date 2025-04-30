import { scopes } from '~/src/server/common/constants/scopes.js'
import {
  initialiseServer,
  mockAuthResponse,
  mockCommonTestSuiteCalls
} from '~/src/server/common/helpers/common-page-rendering.js'
import { fetchAllSecrets } from '~/src/server/services/helpers/fetch/fetch-all-secrets.js'

jest.mock('~/src/server/test-suites/helpers/fetch/fetch-test-runs.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-deployable-service.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/test-suites/helpers/fetch/fetch-test-suite.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-json.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-all-secrets.js')

describe('Secrets Test Suite page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    jest.mocked(fetchAllSecrets).mockResolvedValue({
      'infra-dev': {
        keys: ['SOME_KEY'],
        lastChangedDate: '2024-11-15T16:03:38.3139986Z',
        createdDate: null
      },
      management: {
        keys: ['SOME_KEY'],
        lastChangedDate: '2024-11-15T16:03:38.3139986Z',
        createdDate: null
      }
    })

    mockCommonTestSuiteCalls(jest, 'mock-test-suite')
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('all envs view', () => {
    test('page renders for logged in admin user', async () => {
      mockAuthResponse({
        jest,
        isAdmin: true,
        isTenant: true,
        isAuthenticated: true
      })

      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.admin, scopes.tenant]
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors for logged in tenant who doesnt own service', async () => {
      mockAuthResponse({
        jest,
        isAdmin: false,
        isTenant: true,
        isAuthenticated: true
      })

      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.tenant]
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(403)
    })

    test('page renders for logged in service owner tenant', async () => {
      mockAuthResponse({
        jest,
        isAdmin: false,
        isTenant: true,
        isAuthenticated: true,
        teamScope: 'mock-team-id'
      })

      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.admin, scopes.tenant, 'mock-team-id']
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      mockAuthResponse({
        jest,
        isAuthenticated: false
      })

      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets'
      })
      expect(statusCode).toBe(401)
    })
  })

  describe('single envs view', () => {
    test('page renders for logged in admin user', async () => {
      mockAuthResponse({
        jest,
        isAdmin: true,
        isTenant: true,
        isAuthenticated: true
      })

      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets/infra-dev',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.admin, scopes.tenant]
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors for logged in tenant who doesnt own service', async () => {
      mockAuthResponse({
        jest,
        isAdmin: false,
        isTenant: true,
        isAuthenticated: true
      })

      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets/dev',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.tenant]
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(403)
    })

    test('page renders for logged in service owner tenant', async () => {
      mockAuthResponse({
        jest,
        isAdmin: false,
        isTenant: true,
        isAuthenticated: true,
        teamScope: 'mock-team-id'
      })

      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets/prod',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.admin, scopes.tenant, 'mock-team-id']
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors for logged in service owner tenant', async () => {
      mockAuthResponse({
        jest,
        isAdmin: false,
        isTenant: true,
        isAuthenticated: true,
        teamScope: 'mock-team-id'
      })

      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets/management',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.tenant, 'mock-team-id']
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(404)
    })

    test('page errors with 401 for logged out user', async () => {
      mockAuthResponse({
        jest,
        isAuthenticated: false
      })

      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/secrets/dev'
      })
      expect(statusCode).toBe(401)
    })
  })
})
