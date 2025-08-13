import { waitFor } from '@testing-library/dom'

import { copy } from './copy.js'
import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { clientNotification } from '../../../../client/common/helpers/client-notification.js'

vi.mock('../../../../client/common/helpers/client-notification.js')

describe('#copy', () => {
  let $copyElem

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue()
      }
    })

    vi.useFakeTimers()

    const $component = renderTestComponent('copy', {
      params: {
        content: { id: '1234', text: 'I love chips' }
      }
    })

    document.body.innerHTML = $component.html()

    // Init ClientSide JavaScript
    const $copyElements = Array.from(
      document.querySelectorAll('[data-js="app-copy"]')
    )

    if ($copyElements.length) {
      $copyElements.forEach(copy)
    }

    $copyElem = document.querySelector('[data-testid="app-copy"]')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('When clicked', () => {
    test('Should copy expected text to clipboard', () => {
      $copyElem.click()

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('I love chips')
      )
    })

    test('Should display tick', async () => {
      expect(
        document.querySelector('[data-testid="app-copy-icon"]')
      ).toBeInTheDocument()

      $copyElem.click()

      await waitFor(() => {
        expect(
          document.querySelector('[data-testid="app-tick-icon"]')
        ).toBeInTheDocument()
        expect(
          document.querySelector('[data-testid="app-copy-icon"]')
        ).not.toBeInTheDocument()
      })

      vi.advanceTimersByTime(1600)

      await waitFor(() => {
        expect(
          document.querySelector('[data-testid="app-tick-icon"]')
        ).not.toBeInTheDocument()
        expect(
          document.querySelector('[data-testid="app-copy-icon"]')
        ).toBeInTheDocument()
      })
    })

    test('Should display expected hint text', async () => {
      $copyElem.click()

      await waitFor(() => {
        expect(
          document.querySelector('[data-testid="app-copy-hint"]')
        ).toHaveTextContent('Copied')
      })
    })
  })

  describe('With errors present', () => {
    test('Should show error notification if clipboard API is not supported', async () => {
      delete navigator.clipboard

      $copyElem.click()

      await waitFor(() => {
        expect(clientNotification).toHaveBeenCalledWith(
          'Error copying text to clipboard, select text with your cursor and ctrl + c'
        )
      })
    })

    test('Should show error notification if clipboard writeText throws', async () => {
      navigator.clipboard.writeText = vi
        .fn()
        .mockRejectedValue(new Error('fail'))

      $copyElem.click()

      await waitFor(() => {
        expect(clientNotification).toHaveBeenCalledWith(
          'Error copying text to clipboard, select text with your cursor and ctrl + c'
        )
      })
    })
  })
})
