import fetchMock from 'jest-fetch-mock'

fetchMock.enableMocks()

global.fetch = fetchMock

global.afterEach(() => {
  // Clear down JSDOM document after each test
  document.getElementsByTagName('html')[0].innerHTML = ''
})
