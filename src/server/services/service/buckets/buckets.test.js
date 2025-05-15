import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockBucketsCall,
  mockCommonServicesCalls
} from '~/test-helpers/common-page-rendering.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-all-buckets.js')

const serviceName = 'mock-service-with-buckets'

describe('Service Buckets page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    mockCommonServicesCalls(serviceName)
    mockBucketsCall(serviceName)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  describe('all envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets`,
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant who doesnt own service', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets`,
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets`,
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(401)
    })
  })

  describe('single envs view', () => {
    test('page renders for logged in admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets/infra-dev`,
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page renders for logged in tenant who doesnt own service', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets/dev`,
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('page renders for logged in service owner tenant', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets/prod`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(200)
      expect(result).toMatchFile()
    })

    test('admin only env page errors for logged in service owner tenant', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets/management`,
        isAdmin: false,
        isTenant: true,
        teamScope: 'mock-team-id'
      })
      expect(statusCode).toBe(404)
    })

    test('page errors with 401 for logged out user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: `/services/${serviceName}/buckets/management`,
        isAdmin: false,
        isTenant: false
      })
      expect(statusCode).toBe(401)
    })
  })
})
