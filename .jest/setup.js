import { TextEncoder, TextDecoder } from 'node:util'
import { ReadableStream, TransformStream } from 'node:stream/web'
import { clearImmediate, setImmediate } from 'node:timers'

import { FileMatcherOptions, toMatchFile } from 'jest-file-snapshot'

// TODO - split into separate projects for client and server side tests.
// We support both node and client side unit tests. Using jsdom and poly-filling individual Node.js server needs

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

function toMatchFileWithOptions(
  content,
  filename,
  options = { fileExtension: '.html' }
) {
  return toMatchFile.call(this, content, filename, options)
}

expect.extend({ toMatchFile: toMatchFileWithOptions })

afterEach(() => {
  // Clear down JSDOM document after each test
  document.getElementsByTagName('html')[0].innerHTML = ''
})
