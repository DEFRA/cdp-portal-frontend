import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonTestSuiteCalls,
  mockTestRuns
} from '~/test-helpers/common-page-rendering.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-json.js')
jest.mock('~/src/server/test-suites/helpers/fetch/fetch-test-runs.js')
jest.mock('~/src/server/services/helpers/fetch/fetch-repository.js')
jest.mock('~/src/server/common/helpers/fetch/fetch-entities.js')
jest.mock('~/src/server/common/helpers/auth/get-user-session.js')

describe('About Test Suite page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    const testSuite = 'mock-test-suite'
    mockCommonTestSuiteCalls(jest, testSuite)
    mockTestRuns(jest, testSuite)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/test-suites/mock-test-suite',
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page renders for logged in tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/test-suites/mock-test-suite',
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/test-suites/mock-test-suite',
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })

    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })

  test('page renders for logged out user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, jest, {
      targetUrl: '/test-suites/mock-test-suite',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(200)
    expect(result).toMatchFile()
  })
})
