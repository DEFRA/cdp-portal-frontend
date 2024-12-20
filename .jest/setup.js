import fetchMock from 'jest-fetch-mock'
import { TextEncoder, TextDecoder } from 'node:util'
import { ReadableStream, TransformStream } from 'node:stream/web'

import { config } from '~/src/config/config.js'

// TODO - split into separate projects for client and server side tests.
// We support both node and client side unit tests. Using jsdom and poly-filling individual Node.js server needs

// Globally mock redis
jest.mock('ioredis')

// Node mocks/polyfills
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream
global.TransformStream = TransformStream
global.setImmediate = jest.useRealTimers

// Client side fetch mocking, use nock for Node.js server node-fetch work
global.fetch = fetchMock

// Stub scroll functions not available in JSDOM
Element.prototype.scrollIntoView = jest.fn()
Element.prototype.scroll = jest.fn()

// Globally mock proxyFetch
const proxyFetchMock = jest.fn()
jest.doMock('~/src/server/common/helpers/proxy/proxy-fetch', () => ({
  proxyFetch: proxyFetchMock
}))

beforeAll(() => {
  proxyFetchMock.mockImplementationOnce((url) => {
    // Setting up oidc proxyFetch call
    if (url === config.get('oidcWellKnownConfigurationUrl')) {
      return Promise.resolve({
        json: () => ({
          token_endpoint: 'https://mock-login/oauth2/v2.0/token',
          authorization_endpoint: 'https://mock-login/oauth2/v2.0/authorize'
        })
      })
    }

    return Promise.resolve({})
  })
})

afterEach(() => {
  // Clear down JSDOM document after each test
  document.getElementsByTagName('html')[0].innerHTML = ''
})
