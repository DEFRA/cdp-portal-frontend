import { fetchProxyRules } from '~/src/server/services/helpers/fetch/fetch-proxy-rules.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import {
  initialiseServer,
  mockAuthResponse,
  mockCommonTestSuiteCalls
} from '~/test-helpers/common-page-rendering.js'

jest.mock('~/src/server/test-suites/helpers/fetch/fetch-test-runs.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-deployable-service.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/test-suites/helpers/fetch/fetch-test-suite.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-json.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-proxy-rules.js')

describe('Proxy Test Suite page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    jest
      .mocked(fetchProxyRules)
      .mockImplementation((serviceName, environment) => {
        return {
          environment,
          serviceName,
          defaultDomains: environment !== 'prod' ? ['https://google.com'] : [],
          allowedDomains: environment !== 'prod' ? ['https://abc.com'] : []
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
        isAuthenticated: true,
        teamScope: 'mock-team-id'
      })

      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/proxy',
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

    test('page renders for logged in tenant', async () => {
      mockAuthResponse({
        jest,
        isAdmin: false,
        isTenant: true,
        isAuthenticated: true
      })

      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/proxy',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.tenant]
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
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
        url: '/test-suites/mock-test-suite/proxy',
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
        url: '/test-suites/mock-test-suite/proxy'
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
        url: '/test-suites/mock-test-suite/proxy/infra-dev',
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

    test('page renders for logged in tenant', async () => {
      mockAuthResponse({
        jest,
        isAdmin: false,
        isTenant: true,
        isAuthenticated: true
      })

      const { result, statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/proxy/dev',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.tenant]
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors for logged in tenant', async () => {
      mockAuthResponse({
        jest,
        isAdmin: false,
        isTenant: true,
        isAuthenticated: true
      })

      const { statusCode } = await server.inject({
        method: 'GET',
        url: '/test-suites/mock-test-suite/proxy/infra-dev',
        auth: {
          credentials: {
            user: { id: '123', displayName: 'My Test User' },
            scope: [scopes.tenant]
          },
          strategy: 'default'
        }
      })
      expect(statusCode).toBe(404)
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
        url: '/test-suites/mock-test-suite/proxy/prod',
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
        url: '/test-suites/mock-test-suite/proxy/management',
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
        url: '/test-suites/mock-test-suite/proxy/dev'
      })
      expect(statusCode).toBe(401)
    })
  })
})
