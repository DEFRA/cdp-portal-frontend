import fetchMock from 'jest-fetch-mock'

// Client side fetch mocking, use nock for node-fetch work
global.fetch = fetchMock

global.afterEach(() => {
  // Clear down JSDOM document after each test
  document.getElementsByTagName('html')[0].innerHTML = ''
})
