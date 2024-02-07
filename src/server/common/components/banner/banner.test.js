import { renderTestComponent } from '~/test-helpers/component-helpers'
import { banner } from '~/src/server/common/components/banner/banner'

describe('#banner', () => {
  let bannerElem

  beforeEach(() => {
    jest.useFakeTimers()

    const $component = renderTestComponent('banner', {
      text: 'Total and utter success!',
      type: 'success',
      js: 'app-banner'
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
    jest.useRealTimers()
  })

  test('Should display the banner', () => {
    expect(bannerElem.textContent.trim()).toEqual('Total and utter success!')
    expect(bannerElem.getAttribute('class')).toContain('app-banner--success')
  })

  test('Should not display the banner after removal period', () => {
    expect(bannerElem.textContent.trim()).toEqual('Total and utter success!')

    jest.advanceTimersByTime(40000)

    expect(document.querySelector('[data-testid="app-banner"]')).toBeNull()
  })
})
