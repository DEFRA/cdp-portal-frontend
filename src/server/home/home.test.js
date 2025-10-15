import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'
import {
  initialiseServer,
  mockAuthAndRenderUrl
} from '../../../test-helpers/common-page-rendering.js'
import { renderBlog } from './helpers/render-blog.js'

vi.mock('../common/helpers/auth/get-user-session.js')
vi.mock('./helpers/render-blog.js')

describe('Blog is shown when available', () => {
  let server

  beforeAll(async () => {
    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-09-01T17:16:00.000Z'))
    renderBlog.mockResolvedValue({
      html: '# The CDP Blog',
      toc: '',
      nav: '- (Blog 1)[/blog/post.md]'
    })
    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    vi.useRealTimers()
    renderBlog.mockClear()
  })

  describe('home page', () => {
    test('show blog content', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })
})

describe('Default Home page if blog is unavailable', () => {
  const ie9UserAgent =
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; WOW64; Trident/5.0)'
  let server

  beforeAll(async () => {
    vi.useFakeTimers({ advanceTimers: true })
    vi.setSystemTime(new Date('2025-09-01T17:16:00.000Z'))
    renderBlog.mockRejectedValue(new Error('Async error'))

    server = await initialiseServer()
  })

  afterAll(async () => {
    await server.stop({ timeout: 0 })
    vi.useRealTimers()
    renderBlog.mockClear()
  })

  describe('logged in', () => {
    test('admin user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/',
        isAdmin: true,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('tenant user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/',
        isAdmin: false,
        isTenant: true
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('tenant user old ie', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/',
        isAdmin: false,
        isTenant: true,
        headers: { 'user-agent': ie9UserAgent }
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('unregistered user', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/',
        isAdmin: null,
        isTenant: null
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })

    test('unregistered user on old ie', async () => {
      const { result, statusCode } = await mockAuthAndRenderUrl(server, {
        targetUrl: '/',
        isAdmin: null,
        isTenant: null,
        headers: { 'user-agent': ie9UserAgent }
      })
      expect(statusCode).toBe(statusCodes.ok)
      expect(result).toMatchFile()
    })
  })

  test('logged out user', async () => {
    const { result, statusCode } = await mockAuthAndRenderUrl(server, {
      targetUrl: '/',
      isAdmin: false,
      isTenant: false
    })
    expect(statusCode).toBe(statusCodes.ok)
    expect(result).toMatchFile()
  })
})
