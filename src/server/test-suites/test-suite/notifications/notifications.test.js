import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockCommonTestSuiteCalls,
  mockFetchNotificationRules,
  mockFetchSupportedNotifications,
  mockTestRuns
} from '#test-helpers/common-page-rendering.js'
import { statusCodes } from '@defra/cdp-validation-kit'

vi.mock('#server/common/helpers/fetch/fetch-notifications.js')
vi.mock('#server/common/helpers/fetch/fetch-repository.js')
vi.mock('#server/common/helpers/fetch/fetch-entities.js')
vi.mock('#server/common/helpers/auth/get-user-session.js')

describe('Test suite notifications page', () => {
  let server

  beforeAll(async () => {
    const testSuite = 'mock-test-suite'
    mockCommonTestSuiteCalls(testSuite)
    mockFetchSupportedNotifications()
    mockFetchNotificationRules(testSuite)
    mockTestRuns(testSuite)
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
  })

  test('page renders for logged in admin user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/test-suites/mock-test-suite/notifications',
      isAdmin: true,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged in tenant', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/test-suites/mock-test-suite/notifications',
      isAdmin: false,
      isTenant: true
    })
    expect(statusCode).toBe(statusCodes.forbidden)
  })

  test('page renders for logged in service owner tenant', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/test-suites/mock-test-suite/notifications',
      isAdmin: false,
      isTenant: true,
      teamScope: 'mock-team-id'
    })

    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })

  test('page DOES NOT render for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/test-suites/mock-test-suite/notifications',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })
})
