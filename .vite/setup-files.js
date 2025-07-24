import { vi, afterAll, beforeAll } from 'vitest'
import createFetchMock from 'vitest-fetch-mock'
import '@testing-library/jest-dom/vitest'
import { TextEncoder, TextDecoder } from 'node:util'
import { ReadableStream, TransformStream } from 'node:stream/web'
import { clearImmediate, setImmediate } from 'node:timers'
import { fetchWellknown } from '../src/server/common/helpers/fetch/fetch-well-known.js'

const fetchMock = createFetchMock(vi)
vi.mock('../src/server/common/helpers/fetch/fetch-well-known.js')

// Globally mock redis
vi.mock('ioredis')

// Node mocks/polyfills
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream
global.TransformStream = TransformStream
global.setImmediate = setImmediate
global.clearImmediate = clearImmediate

// Stub scroll functions not available in JSDOM
Element.prototype.scrollIntoView = vi.fn()
Element.prototype.scroll = vi.fn()

beforeAll(async () => {
  fetchMock.enableMocks()
  global.fetch = fetchMock
  global.fetchMock = fetchMock

  // Mock wellknown fetch on server startup
  vi.mocked(fetchWellknown).mockResolvedValue({
    token_endpoint: 'https://mock-login/oauth2/v2.0/token',
    authorization_endpoint: 'https://mock-login/oauth2/v2.0/authorize'
  })
})

afterAll(async () => {
  fetchMock.disableMocks()
  // TODO: check if this should be afterEach once tests all pass
  document.getElementsByTagName('html')[0].innerHTML = ''
})
