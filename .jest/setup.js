import fetchMock from 'jest-fetch-mock'
import { TextEncoder, TextDecoder } from 'node:util'
import { ReadableStream, TransformStream } from 'node:stream/web'

import { config } from '~/src/config'

// We support both node and client side unit tests. Using jsdom and poly-filling individual Node.js server needs

// Globally mock redis
jest.mock('ioredis')

// Node mocks/polyfills
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream
global.TransformStream = TransformStream
global.setImmediate = jest.useRealTimers

// Client side fetch mocking, use nock for node-fetch work
global.fetch = fetchMock

// Stub scroll functions not available in JSDOM
Element.prototype.scrollIntoView = jest.fn()
Element.prototype.scroll = jest.fn()

afterEach(() => {
  // Clear down JSDOM document after each test
  document.getElementsByTagName('html')[0].innerHTML = ''
})
