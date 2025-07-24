import { xhrRequest } from './xhr.js'
import { eventName } from '../constants/event-name.js'
import { subscribe, unsubscribe } from './event-emitter.js'

const mockHistoryPush = vi.fn()
const mockHistoryReplace = vi.fn()

vi.mock('history', () => ({
  createBrowserHistory: () => ({
    push: (url) => mockHistoryPush(url),
    replace: (url, options) => mockHistoryReplace(url, options)
  })
}))

describe('#xhr', () => {
  const mockXhrResponse = '<div data-xhr="xhr-container">Xhr response</div>'
  const mockUrl = '/mock-xhr-request'
  let mockEventListener

  beforeEach(() => {
    mockEventListener = vi.fn()

    // Append xhr container to the document
    document.body.innerHTML = '<div data-xhr="xhr-container"></div>'

    subscribe(eventName.xhrUpdate, mockEventListener)
    fetch.mockResponse(() => Promise.resolve(mockXhrResponse))
  })

  afterEach(() => {
    unsubscribe(eventName.xhrUpdate, mockEventListener)
  })

  describe('When making an xhr request', () => {
    beforeEach(async () => {
      await xhrRequest(mockUrl, { q: 'mock-param' })
    })

    test('Should call history push as expected', () => {
      expect(mockHistoryPush).toHaveBeenCalledWith('?q=mock-param')
    })

    test('Should inject xhr content', () => {
      const xhrContainer = document.querySelector('[data-xhr="xhr-container"]')

      expect(xhrContainer).toHaveTextContent('Xhr response')
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
      await xhrRequest(mockUrl, { q: 'mock-param' })
    })

    test('Should call history push as expected', () => {
      expect(mockHistoryPush).toHaveBeenCalledWith('?q=mock-param')
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
})
