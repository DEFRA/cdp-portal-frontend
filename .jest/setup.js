import { TextEncoder, TextDecoder } from 'node:util'
import { ReadableStream, TransformStream } from 'node:stream/web'
import { clearImmediate, setImmediate } from 'node:timers'

import { fetchWellknown } from '~/src/server/common/helpers/fetch/fetch-well-known.js'
import { toMatchFileWithOptions } from '~/test-helpers/to-match-file.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-well-known.js')

// Globally mock redis
jest.mock('ioredis')

// Node mocks/polyfills
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream
global.TransformStream = TransformStream
global.setImmediate = setImmediate
global.clearImmediate = clearImmediate

// Stub scroll functions not available in JSDOM
Element.prototype.scrollIntoView = jest.fn()
Element.prototype.scroll = jest.fn()

expect.extend({ toMatchFile: toMatchFileWithOptions })

beforeAll(() => {
  // Mock wellknown fetch on server startup
  jest.mocked(fetchWellknown).mockResolvedValue({
    token_endpoint: 'https://mock-login/oauth2/v2.0/token',
    authorization_endpoint: 'https://mock-login/oauth2/v2.0/authorize'
  })
})

afterEach(() => {
  // Clear down JSDOM dom
  document.getElementsByTagName('html')[0].innerHTML = ''
})
