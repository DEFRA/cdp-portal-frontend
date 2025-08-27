import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonTestSuiteCalls,
  mockTestRuns
} from '../../../../../test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'

vi.mock('../../helpers/fetch/fetch-test-runs.js')
vi.mock('../../../common/helpers/fetch/fetch-repository.js')
vi.mock('../../../common/helpers/fetch/fetch-entities.js')
vi.mock('../../../common/helpers/auth/get-user-session.js')

describe('About Test Suite page', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    const testSuite = 'mock-test-suite'
    mockCommonTestSuiteCalls(testSuite)
    mockTestRuns(testSuite)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/test-suites/mock-test-suite',
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for logged in tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/test-suites/mock-test-suite',
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/test-suites/mock-test-suite',
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page renders for logged out user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/test-suites/mock-test-suite',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
