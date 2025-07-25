import { describe, expect, test, vi } from 'vitest'
import { asExternalUrl, redirectWithRefresh } from './url-helpers.js'

describe('asExternalUrl', () => {
  test('should replaces the host, protocol and port with an external url', () => {
    const internalUrl = 'http://localhost:3000/foo/bar?baz=123'
    const externalUrl = 'https://my-service.com'
    const result = asExternalUrl(internalUrl, externalUrl)
    expect(result).toStrictEqual(
      new URL('https://my-service.com/foo/bar?baz=123')
    )
  })

  test('should accept URLs', () => {
    const internalUrl = new URL('http://localhost:3000/foo/bar?baz=123')
    const externalUrl = new URL('https://my-service.com')
    const result = asExternalUrl(internalUrl, externalUrl)
    expect(result).toStrictEqual(
      new URL('https://my-service.com/foo/bar?baz=123')
    )
  })
})

describe('redirectWithRefresh', () => {
  test('should response with forced redirect', () => {
    const h = {
      response: vi.fn().mockReturnValue({ takeover: vi.fn() })
    }
    redirectWithRefresh(h, '/foo/bar')
    expect(h.response).toHaveBeenCalledWith(
      `<html><head><meta http-equiv="refresh" content="0;URL='/foo/bar'"></head><body></body></html>`
    )
  })

  test('should response with forced redirect with absolute url', () => {
    const h = {
      response: vi.fn().mockReturnValue({ takeover: vi.fn() })
    }
    redirectWithRefresh(h, 'https://example.com/foo/bar')
    expect(h.response).toHaveBeenCalledWith(
      `<html><head><meta http-equiv="refresh" content="0;URL='https://example.com/foo/bar'"></head><body></body></html>`
    )
  })

  test('should escape the url correctly', () => {
    const h = {
      response: vi.fn().mockReturnValue({ takeover: vi.fn() })
    }
    redirectWithRefresh(h, '/foo/bar?a="/><script>alert()</script>')
    expect(h.response).toHaveBeenCalledWith(
      `<html><head><meta http-equiv="refresh" content="0;URL='/foo/bar?a=&quot;/&gt;&lt;script&gt;alert()&lt;/script&gt;'"></head><body></body></html>`
    )
  })
})
