import { renderTestComponent } from '~/test-helpers/component-helpers.js'
import { search } from '~/src/server/common/components/search/search.js'

describe('#search', () => {
  let searchInput

  beforeEach(() => {
    // Mock scroll function that's not available in JSDOM
    Element.prototype.scroll = jest.fn()

    const $component = renderTestComponent('search', {
      label: {
        text: 'Search me'
      },
      hint: {
        text: 'Search for deployments by name'
      },
      id: 'search',
      name: 'q'
    })

    // Append search component to a form and then add it to the document
    document.body.innerHTML = `<form id="mock-search-form">
        ${$component('[data-testid="app-search-group"]').first().html()}
      </form>`

    // Init ClientSide JavaScript
    const searchComponents = Array.from(
      document.querySelectorAll('[data-js="app-search"]')
    )

    if (searchComponents.length) {
      searchComponents.forEach(($search) => search($search))
    }

    searchInput = document.querySelector('[data-testid="app-search-input"]')
  })

  describe('When value entered into input', () => {
    beforeEach(() => {
      searchInput.focus()
      searchInput.value = 'fro'
      searchInput.dispatchEvent(new Event('input'))
    })

    test('Should display clear button', () => {
      const clearButton = document.querySelector(
        '[data-testid="app-search-clear-button"]'
      )

      expect(clearButton).toHaveAttribute('aria-hidden', 'false')
    })
  })

  describe('When value removed from input', () => {
    beforeEach(() => {
      searchInput.focus()

      // Add value to input
      searchInput.value = 'fro'
      searchInput.dispatchEvent(new Event('input'))

      // Remove value from input
      searchInput.value = ''
      searchInput.dispatchEvent(new Event('input'))
    })

    test('Should not display clear button', () => {
      const clearButton = document.querySelector(
        '[data-testid="app-search-clear-button"]'
      )

      expect(clearButton).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
