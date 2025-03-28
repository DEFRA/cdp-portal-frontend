import qs from 'qs'
import fetchMock from 'jest-fetch-mock'

import { xhrRequest } from '~/src/client/common/helpers/xhr.js'
import { eventName } from '~/src/client/common/constants/event-name.js'
import {
  subscribe,
  unsubscribe
} from '~/src/client/common/helpers/event-emitter.js'

const mockHistoryPush = jest.fn()
const mockHistoryReplace = jest.fn()

jest.mock('history', () => ({
  createBrowserHistory: () => ({
    push: (url) => mockHistoryPush(url),
    replace: (url, options) => mockHistoryReplace(url, options)
  })
}))

function setUrlQueryParam(params) {
  global.window = Object.create(window)
  Object.defineProperty(window, 'location', {
    value: {
      search: qs.stringify(params, {
        arrayFormat: 'repeat',
        addQueryPrefix: true
      })
    }
  })
}

describe('#xhr', () => {
  const mockXhrResponse = '<div data-xhr="xhr-container">Xhr response</div>'
  const mockUrl = '/mock-xhr-request'
  let mockEventListener

  beforeEach(() => {
    mockEventListener = jest.fn()

    fetchMock.enableMocks()

    // Append xhr container to the document
    document.body.innerHTML = '<div data-xhr="xhr-container"></div>'

    subscribe(eventName.xhrUpdate, mockEventListener)
    fetch.mockResponse(() => Promise.resolve(mockXhrResponse))
  })

  afterEach(() => {
    unsubscribe(eventName.xhrUpdate, mockEventListener)
    fetchMock.disableMocks()
  })

  describe('When making an xhr request', () => {
    beforeEach(async () => {
      setUrlQueryParam({})
      await xhrRequest(mockUrl, { q: 'mock-param' })
    })

    test('Should call history push as expected', () => {
      expect(mockHistoryPush).toHaveBeenCalledWith('?q=mock-param')
    })

    test('Should inject xhr content', () => {
      const xhrContainer = document.querySelector('[data-xhr="xhr-container"]')

      expect(xhrContainer.textContent).toBe('Xhr response')
    })

    test('Should call history replace as expected', () => {
      expect(mockHistoryReplace).toHaveBeenCalledWith('?q=mock-param', {
        xhrData: '<div data-xhr="xhr-container">Xhr response</div>'
      })
    })

    test('Should fire "xhrUpdate" subscribed event', () => {
      expect(mockEventListener.mock.calls[0][0].detail).toEqual({
        params: {
          q: 'mock-param'
        }
      })
    })
  })

  describe('When url has query params', () => {
    beforeEach(async () => {
      setUrlQueryParam({ ted: true, animals: ['dog', 'cat'] })
      await xhrRequest(mockUrl, { q: 'mock-param' })
    })

    test('Should call history push as expected', () => {
      expect(mockHistoryPush).toHaveBeenCalledWith(
        '?ted=true&animals=dog&animals=cat&q=mock-param'
      )
    })

    test('Should call history replace as expected', () => {
      expect(mockHistoryReplace).toHaveBeenCalledWith(
        '?ted=true&animals=dog&animals=cat&q=mock-param',
        {
          xhrData: '<div data-xhr="xhr-container">Xhr response</div>'
        }
      )
    })

    test('Should fire "xhrUpdate" subscribed event', () => {
      expect(mockEventListener.mock.calls[0][0].detail).toEqual({
        params: {
          animals: ['dog', 'cat'],
          q: 'mock-param',
          ted: 'true'
        }
      })
    })
  })
})
