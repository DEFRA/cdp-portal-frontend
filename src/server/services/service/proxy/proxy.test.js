import { fetchProxyRules } from '~/src/server/services/helpers/fetch/fetch-proxy-rules.js'
import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockServiceEntityCall
} from '~/test-helpers/common-page-rendering.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-proxy-rules.js')

describe('Service Proxy page', () => {
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

    mockServiceEntityCall('mock-service-with-proxy', undefined)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('all envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(401)
    })
  })

  describe('single envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy/infra-dev',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy/dev',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('admin only env page errors for logged in tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy/infra-dev',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(404)
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy/prod',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('admin only env page errors for logged in service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy/management',
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(404)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/services/mock-service-with-proxy/proxy/management',
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(401)
    })
  })
})
