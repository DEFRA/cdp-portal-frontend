import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'
import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockFetchCdpUserCall
} from '../../../test-helpers/common-page-rendering.js'

vi.mock('../common/helpers/auth/get-user-session.js')
vi.mock('../admin/users/helpers/fetch/fetchers.js')

describe('User profile page', () => {
  let server

  beforeAll(async () => {
    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-09-01T17:16:00.000Z'))

    server = await initialiseServer()
    mockFetchCdpUserCall()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    vi.useRealTimers()
  })

  describe('logged in', () => {
    test('admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/user-profile',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/user-profile',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('unregistered user', async () => {
      const { statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/user-profile',
        isAdmin: null,
        isTenant: null
      })
      expect(statusCode).toBe(statusCodes.forbidden)
    })
  })

  test('page errors with 401 for logged out user', async () => {
    const { statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/user-profile',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.unauthorized)
  })
})
