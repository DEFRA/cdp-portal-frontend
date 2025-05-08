import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonServicesCalls,
  mockServicesAdditionalCalls
} from '~/test-helpers/common-page-rendering.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-running-services.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-vanity-urls.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-api-gateways.js')
jest.mock(
  '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
)
jest.mock('~/src/server/common/helpers/fetch/fetch-json.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')

describe('About Service page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    mockCommonServicesCalls(jest, 'mock-service', 'frontend')
    mockServicesAdditionalCalls(jest, 'mock-service', 'frontend')
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/services/mock-service',
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page renders for logged in tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/services/mock-service',
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/services/mock-service',
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page renders for logged out user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/services/mock-service',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })
})
