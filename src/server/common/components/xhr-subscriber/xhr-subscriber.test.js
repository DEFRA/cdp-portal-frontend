import { xhrRequest } from '~/src/client/common/helpers/xhr.js'
import { renderTestComponent } from '~/test-helpers/component-helpers.js'
import { xhrSubscriber } from '~/src/server/common/components/xhr-subscriber/xhr-subscriber.js'
import { publish } from '~/src/client/common/helpers/event-emitter.js'
import { clientNotification } from '~/src/client/common/helpers/client-notification.js'
import { flushAsync } from '~/test-helpers/flush-async.js'

jest.mock('~/src/client/common/helpers/client-notification.js')
jest.mock('~/src/client/common/helpers/xhr.js')

describe('#xhrSubscriber', () => {
  const mockEventName = 'test-event'
  const mockXhrUrl = '/mock-xhr-url'

  beforeEach(() => {
    const $component = renderTestComponent('xhr-subscriber', {
      id: 'mock-subscriber',
      subscribeTo: mockEventName,
      xhrUrl: mockXhrUrl
    })

    // Append xhrSubscriber component to the document
    document.body.innerHTML = $component.html()

    // Init ClientSide JavaScript
    const $xhrSubscribers = Array.from(
      document.querySelectorAll('[data-js="app-xhr-subscriber"]')
    )
    if ($xhrSubscribers.length) {
      $xhrSubscribers.forEach(xhrSubscriber)
    }
  })

  test('Should call subscriber', async () => {
    xhrRequest.mockResolvedValue({ ok: true })

    publish(mockEventName, {
      queryParams: { left: true, plants: ['cactus', 'prayer plant'] }
    })

    await flushAsync()

    expect(xhrRequest).toHaveBeenCalledWith(mockXhrUrl, {
      left: true,
      plants: ['cactus', 'prayer plant']
    })

    expect(clientNotification).not.toHaveBeenCalled()
  })

  test('Should provide error message on xhr error', async () => {
    xhrRequest.mockResolvedValue({ ok: false })

    publish(mockEventName, {
      queryParams: { left: true, plants: ['cactus', 'prayer plant'] }
    })

    await flushAsync()

    expect(clientNotification).toHaveBeenCalledWith(
      'Could not fetch details, refresh the page'
    )
  })
})
