import { fetchProxyRules } from '../../../services/helpers/fetch/fetch-proxy-rules.js'
import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonTestSuiteCalls
} from '../../../../../test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'

vi.mock('../../helpers/fetch/fetch-test-runs.js')
vi.mock('../../../common/helpers/fetch/fetch-tenant-service.js')
vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/fetch/fetch-repository.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')
vi.mock('../../../services/helpers/fetch/fetch-proxy-rules.js')

describe('Proxy Test Suite page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    vi.mocked(fetchProxyRules).mockImplementation(
      (serviceName, environment) => {
        return {
          environment,
          serviceName,
          defaultDomains: environment !== 'prod' ? ['https://google.com'] : [],
          allowedDomains: environment !== 'prod' ? ['https://abc.com'] : []
        }
      }
    )

    mockCommonTestSuiteCalls('mock-test-suite')
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('all envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })

  describe('single envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy/infra-dev',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy/dev',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('admin only env page errors for logged in tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy/infra-dev',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(404)
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy/prod',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('admin only env page errors for logged in service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy/management',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(404)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/test-suites/mock-test-suite/proxy/management',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(statusCodes.unauthorized)
    })
  })
})
