import {
  publish,
  subscribe,
  unsubscribe
} from '~/src/client/common/helpers/event-emitter'

describe('#eventEmitter', () => {
  const eventName = 'mock-event'
  const mockEventListener = jest.fn()

  test('Subscribed should fire as expected when published to', () => {
    subscribe(eventName, mockEventListener)
    publish(eventName)

    expect(mockEventListener).toHaveBeenCalled()
  })

  test('Subscribed should fire with expected detail', () => {
    subscribe(eventName, mockEventListener)
    publish(eventName, { everything: 'Is Awesome' })

    expect(mockEventListener.mock.calls[0][0].detail).toEqual({
      everything: 'Is Awesome'
    })
  })

  test('Unsubscribed listener should not fire when published', () => {
    subscribe(eventName, mockEventListener)
    unsubscribe(eventName, mockEventListener)
    publish(eventName)

    expect(mockEventListener).not.toHaveBeenCalled()
  })
})
