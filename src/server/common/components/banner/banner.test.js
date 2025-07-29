import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { banner } from './banner.js'

describe('#banner', () => {
  let bannerElem

  beforeEach(() => {
    vi.useFakeTimers()

    const $component = renderTestComponent('banner', {
      params: {
        text: 'Total and utter success!',
        type: 'success',
        js: 'app-banner'
      }
    })

    // Append banner component to the document
    document.body.innerHTML = $component.html()

    // Init ClientSide JavaScript
    const banners = Array.from(
      document.querySelectorAll('[data-js="app-banner"]')
    )

    if (banners.length) {
      banners.forEach(banner)
    }

    bannerElem = document.querySelector('[data-testid="app-banner"]')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Should display the banner', () => {
    expect(bannerElem.textContent.trim()).toBe('Total and utter success!')
    expect(bannerElem).toHaveAttribute(
      'class',
      expect.stringContaining('app-banner--success')
    )
  })

  test('Should not display the banner after removal period', () => {
    expect(bannerElem.textContent.trim()).toBe('Total and utter success!')

    vi.advanceTimersByTime(40000)

    expect(document.querySelector('[data-testid="app-banner"]')).toBeNull()
  })
})
