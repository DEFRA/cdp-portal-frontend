import { TextEncoder, TextDecoder } from 'node:util'
import { ReadableStream, TransformStream } from 'node:stream/web'
import { clearImmediate, setImmediate } from 'node:timers'
import { toMatchFile } from 'jest-file-snapshot'

import { fetchWellknown } from '~/src/server/common/helpers/fetch/fetch-well-known.js'

jest.mock('~/src/server/common/helpers/fetch/fetch-well-known.js')

// TODO
//  - Split into separate projects for client and server tests by folder location?
//  - Split into separate configs for unit and integration tests .unit.test.ts and .integration.test.ts
//  - We support both node and client side unit tests. Using jsdom and poly-filling individual Node.js server needs
//  - This file is getting a little big

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

// Augment the toMatchFile method to provide extra functionality. Serve with local assets, provide global defaults
function toMatchFileWithOptions(
  content,
  filename,
  options = { fileExtension: '.html' }
) {
  // Update assets path to use local assets so html snapshot uses the local assets provided via the pretest npm script
  const updatedContent = content.replace(/\/public/g, '/.public')

  return toMatchFile.call(this, updatedContent, filename, options)
}

expect.extend({ toMatchFile: toMatchFileWithOptions })

beforeAll(() => {
  jest.mocked(fetchWellknown).mockResolvedValue({
    token_endpoint: 'https://mock-login/oauth2/v2.0/token',
    authorization_endpoint: 'https://mock-login/oauth2/v2.0/authorize'
  })
})

afterEach(() => {
  // Clear down JSDOM document after each test
  document.getElementsByTagName('html')[0].innerHTML = ''
})
