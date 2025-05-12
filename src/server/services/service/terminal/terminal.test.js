import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonServicesCalls,
  mockTenantServicesCall
} from '~/test-helpers/common-page-rendering.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-json.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js')

describe('Service Terminal page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    const serviceName = 'mock-service-with-terminal'
    mockCommonServicesCalls(jest, serviceName)
    mockTenantServicesCall({ jest })
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page errors for logged in non-service owner tenant', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(403)
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page errors with 401 for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/services/mock-service-with-terminal/terminal',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(401)
  })
})
