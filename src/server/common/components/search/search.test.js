import { renderTestComponent } from '~/test-helpers/component-helpers'
import { search } from '~/src/server/common/components/search/search'

describe('#search', () => {
  let searchInput
  let suggestionsContainer

  beforeEach(() => {
    // Mock scroll function that's not available in JSDOM
    Element.prototype.scroll = jest.fn()

    const $component = renderTestComponent('search', {
      label: 'Search me',
      id: 'search',
      name: 'q',
      suggestions: [
        {
          label: 'cdp-portal-frontend',
          value: 'cdp-portal-frontend'
        },
        {
          label: 'cdp-self-service-ops',
          value: 'cdp-self-service-ops'
        },
        {
          label: 'cdp-teams-and-repositories',
          value: 'cdp-teams-and-repositories'
        }
      ]
    })

    // Add suggestions
    const scriptElement = document.createElement('script')
    scriptElement.innerHTML = $component(
      '[data-testid="app-search-suggestions"]'
    )
      .first()
      .html()
    document.getElementsByTagName('html')[0].appendChild(scriptElement)

    // Append search component to a form and then add it to the document
    document.body.innerHTML = `<form id="mock-search-form">
        ${$component('[data-testid="app-search-container"]').first().html()}
      </form>`

    // Init ClientSide JavaScript
    const searchComponents = Array.from(
      document.querySelectorAll('[data-js="app-search"]')
    )

    if (searchComponents.length) {
      searchComponents.forEach(($search) => search($search))
    }

    searchInput = document.querySelector('[data-testid="app-search-input"]')
    suggestionsContainer = document.querySelector(
      '[data-testid="app-search-suggestions"]'
    )
  })

  test('On load should not show suggestions', () => {
    expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
  })

  describe('When clicked', () => {
    beforeEach(() => {
      searchInput.click()
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })

    test('Should contain expected suggestions when input focused', () => {
      const children = suggestionsContainer.children

      expect(children.length).toEqual(3)

      expect(children[0].textContent).toEqual('cdp-portal-frontend')
      expect(children[1].textContent).toEqual('cdp-self-service-ops')
      expect(children[2].textContent).toEqual('cdp-teams-and-repositories')
    })
  })

  describe('When focussed', () => {
    beforeEach(() => {
      searchInput.focus()
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })

    test('Should contain expected suggestions when input focused', () => {
      const children = suggestionsContainer.children

      expect(children.length).toEqual(3)

      expect(children[0].textContent).toEqual('cdp-portal-frontend')
      expect(children[1].textContent).toEqual('cdp-self-service-ops')
      expect(children[2].textContent).toEqual('cdp-teams-and-repositories')
    })
  })

  describe('When "tab" key pressed', () => {
    beforeEach(() => {
      searchInput.focus()

      const tabKeyEvent = new KeyboardEvent('keydown', { code: 'tab' })
      searchInput.dispatchEvent(tabKeyEvent)
    })

    test('Should close suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })
  })

  describe('When value entered into input', () => {
    beforeEach(() => {
      searchInput.focus()
      searchInput.value = 'fro'
      searchInput.dispatchEvent(new Event('input'))
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })

    test('Should narrow to expected suggestion', () => {
      expect(suggestionsContainer.children.length).toEqual(1)
      expect(suggestionsContainer.children[0].textContent).toEqual(
        'cdp-portal-frontend'
      )
    })

    test('Should display close button', () => {
      const closeButton = document.querySelector(
        '[data-testid="app-search-close-button"]'
      )

      expect(closeButton.getAttribute('aria-hidden')).toEqual('false')
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

    test('Suggestions should be open', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })

    test('Should contain expected suggestions', () => {
      const children = suggestionsContainer.children

      expect(children.length).toEqual(3)

      expect(children[0].textContent).toEqual('cdp-portal-frontend')
      expect(children[1].textContent).toEqual('cdp-self-service-ops')
      expect(children[2].textContent).toEqual('cdp-teams-and-repositories')
    })

    test('Should not display close button', () => {
      const closeButton = document.querySelector(
        '[data-testid="app-search-close-button"]'
      )

      expect(closeButton.getAttribute('aria-hidden')).toEqual('true')
    })
  })

  describe('When value without results entered into input', () => {
    beforeEach(() => {
      searchInput.focus()
      searchInput.value = 'blah'
      searchInput.dispatchEvent(new Event('input'))
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })

    test('Should provide no results message', () => {
      expect(suggestionsContainer.children.length).toEqual(1)
      expect(suggestionsContainer.children[0].textContent).toEqual('No results')
    })
  })

  describe('When "backspace" pressed in empty input', () => {
    beforeEach(() => {
      searchInput.focus()

      const backspaceKeyEvent = new KeyboardEvent('keydown', {
        code: 'backspace'
      })
      searchInput.dispatchEvent(backspaceKeyEvent)
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(searchInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })
  })

  describe('When "escape" key pressed', () => {
    beforeEach(() => {
      searchInput.focus()

      const escapeKeyEvent = new KeyboardEvent('keydown', {
        code: 'escape'
      })
      searchInput.dispatchEvent(escapeKeyEvent)
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(searchInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })
  })

  describe('When "arrow" keys pressed', () => {
    beforeEach(() => {
      searchInput.focus()
    })

    test('Once, should highlight first suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      searchInput.dispatchEvent(arrowDownKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('true')
      expect(children[1].getAttribute('aria-selected')).toEqual('false')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })

    test('Twice, should highlight second suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      searchInput.dispatchEvent(arrowDownKeyEvent)
      searchInput.dispatchEvent(arrowDownKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('false')
      expect(children[1].getAttribute('aria-selected')).toEqual('true')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })

    test('Up and Down keys, should highlight expected suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      searchInput.dispatchEvent(arrowDownKeyEvent)
      searchInput.dispatchEvent(arrowDownKeyEvent)
      searchInput.dispatchEvent(arrowDownKeyEvent)

      const arrowUpKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowup'
      })
      searchInput.dispatchEvent(arrowUpKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('false')
      expect(children[1].getAttribute('aria-selected')).toEqual('true')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })
  })

  describe('When "enter" key pressed in suggestions', () => {
    beforeEach(() => {
      searchInput.focus()

      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      searchInput.dispatchEvent(arrowDownKeyEvent)

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      searchInput.dispatchEvent(enterKeyEvent)
    })

    test('Should provide expected suggestion value', () => {
      expect(searchInput.value).toEqual('cdp-portal-frontend')
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(searchInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })
  })

  describe('When suggestion is clicked', () => {
    beforeEach(() => {
      searchInput.focus()
      suggestionsContainer.children[1].click()
    })

    test('Should provide expected suggestion value', () => {
      expect(searchInput.value).toEqual('cdp-self-service-ops')
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(searchInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })
  })

  describe('When "enter" key is pressed with input value', () => {
    beforeEach(() => {
      searchInput.focus()

      // Add value to input
      searchInput.value = 'fro'
      searchInput.dispatchEvent(new Event('input'))

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      searchInput.dispatchEvent(enterKeyEvent)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })
  })

  describe('When "enter" key is pressed without input value', () => {
    beforeEach(() => {
      searchInput.focus()

      const escapeKeyEvent = new KeyboardEvent('keydown', {
        code: 'escape'
      })
      searchInput.dispatchEvent(escapeKeyEvent)

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      searchInput.dispatchEvent(enterKeyEvent)
    })

    test('Suggestions should be open', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })
  })

  describe('When element outside of search is clicked', () => {
    beforeEach(() => {
      searchInput.focus()
      document.body.click()
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })
  })
})
