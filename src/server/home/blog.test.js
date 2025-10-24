import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'
import {
  initialiseServer,
  mockAuthAndRenderUrl,
  mockBlogArticle
} from '../../../test-helpers/common-page-rendering.js'

vi.mock('../common/helpers/auth/get-user-session.js')
vi.mock('../documentation/helpers/s3-file-handler.js')

describe('Blog page', () => {
  let server

  beforeAll(async () => {
    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-09-01T17:16:00.000Z'))

    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    vi.useRealTimers()
  })

  describe('logged in', () => {
    test('admin user', async () => {
      await mockBlogArticle('20251017-introducing-the-cdp-blog.md')

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/blog/20251017-introducing-the-cdp-blog.md',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('tenant user', async () => {
      await mockBlogArticle('20251024-passing-profile-to-the-test-suite.md')

      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/blog/20251024-passing-profile-to-the-test-suite.md',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })

  test('logged out user', async () => {
    await mockBlogArticle('20251017-introducing-the-cdp-blog.md')

    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/blog/20251017-introducing-the-cdp-blog.md',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
