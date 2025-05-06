import {
  initialiseServer,
  mockAuthResponse,
  mockCommonTestSuiteCalls
} from '~/test-helpers/common-page-rendering.js'

jest.mock('~/src/server/test-suites/helpers/fetch/fetch-test-runs.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-deployable-service.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-tenant-service.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-json.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')

describe('About Test Suite page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    mockCommonTestSuiteCalls(jest, 'mock-test-suite')
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    mockAuthResponse({
      jest,
      isAdmin: true,
      isTenant: true,
      isAuthenticated: true
    })

    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/test-suites/mock-test-suite'
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
      url: '/test-suites/mock-test-suite'
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
      url: '/test-suites/mock-test-suite'
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page renders for logged out user', async () => {
    mockAuthResponse({
      jest,
      isAuthenticated: false
    })

    const { result, statusCode } = await server.inject({
      method: 'GET',
      url: '/test-suites/mock-test-suite'
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })
})
