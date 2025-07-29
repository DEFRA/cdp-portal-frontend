import { tabs } from './tabs.js'
import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { dispatchDomContentLoaded } from '../../../../../test-helpers/dispatch-dom-content-loaded.js'
import { history } from '../../../../client/common/helpers/history.js'

function setupTabsComponent(options = {}) {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: {
      ...window.location,
      search: options?.search ?? '',
      assign: vi.fn(),
      replace: vi.fn()
    }
  })

  const $tabs = renderTestComponent('tabs', {
    params: {
      tabs: [
        { isActive: true, url: '/tab-one', label: 'One' },
        { isActive: false, url: '/tab-two', label: 'Two' },
        { isActive: false, url: '/tab-three', label: 'Three' }
      ]
    }
  })

  // Add tabs to the document
  document.body.innerHTML = $tabs.html()

  // Init ClientSide JavaScript
  const tabsElements = Array.from(
    document.querySelectorAll('[data-js="app-tabs"]')
  )

  if (tabsElements.length) {
    tabsElements.forEach(tabs)
  }

  const $firstTabLink = document.querySelector(
    '[data-testid="app-tabs-list-item__anchor-one"]'
  )
  const $secondTabLink = document.querySelector(
    '[data-testid="app-tabs-list-item__anchor-two"]'
  )
  const $thirdTabLink = document.querySelector(
    '[data-testid="app-tabs-list-item__anchor-three"]'
  )

  return {
    $firstTabLink,
    $secondTabLink,
    $thirdTabLink
  }
}

describe('#tabs', () => {
  let $firstTabLink, $secondTabLink, $thirdTabLink

  describe('On page load', () => {
    test('With query params tab hrefs should have expected appended params', () => {
      ;({ $firstTabLink, $secondTabLink, $thirdTabLink } = setupTabsComponent({
        search: '?page=1&size=50&service=cdp-portal-frontend&user=RoboCop'
      }))

      dispatchDomContentLoaded()

      expect($firstTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-one?page=1&size=50&service=cdp-portal-frontend&user=RoboCop'
      )
      expect($secondTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-two?page=1&size=50&service=cdp-portal-frontend&user=RoboCop'
      )
      expect($thirdTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-three?page=1&size=50&service=cdp-portal-frontend&user=RoboCop'
      )
    })

    test('Without query params tab hrefs should have expected appended params', () => {
      ;({ $firstTabLink, $secondTabLink, $thirdTabLink } = setupTabsComponent({
        search: '?service=cdp-portal-frontend&user=RoboCop'
      }))

      dispatchDomContentLoaded()

      expect($firstTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-one?service=cdp-portal-frontend&user=RoboCop'
      )
      expect($secondTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-two?service=cdp-portal-frontend&user=RoboCop'
      )
      expect($thirdTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-three?service=cdp-portal-frontend&user=RoboCop'
      )
    })
  })

  describe('On url change', () => {
    beforeEach(() => {
      ;({ $firstTabLink, $secondTabLink, $thirdTabLink } = setupTabsComponent({
        search: '?page=4&size=40&service=cdp-portal-backend&user=Mumm-ra'
      }))
    })

    test('Should carry params onto tab href as expected', () => {
      history.push(
        '/tab-two?page=4&size=40&service=cdp-portal-backend&user=Mumm-ra'
      )

      expect($firstTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-one?page=4&size=40&service=cdp-portal-backend&user=Mumm-ra'
      )
      expect($secondTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-two?page=4&size=40&service=cdp-portal-backend&user=Mumm-ra'
      )
      expect($thirdTabLink.getAttribute('href')).toBe(
        'http://localhost:3000/tab-three?page=4&size=40&service=cdp-portal-backend&user=Mumm-ra'
      )
    })
  })
})
