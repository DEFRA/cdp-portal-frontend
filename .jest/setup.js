import fetchMock from 'jest-fetch-mock'

// Client side fetch mocking, use nock for node-fetch work
global.fetch = fetchMock

// Stub scroll functions not available in JSDOM
Element.prototype.scrollIntoView = jest.fn()
Element.prototype.scroll = jest.fn()

afterEach(() => {
  // Clear down JSDOM document after each test
  document.getElementsByTagName('html')[0].innerHTML = ''
})
