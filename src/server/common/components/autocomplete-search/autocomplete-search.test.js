import { renderTestComponent } from '~/test-helpers/component-helpers'
import { autocompleteSearch } from '~/src/server/common/components/autocomplete-search/autocomplete-search'

describe('#autocompleteSearch', () => {
  let autocompleteSearchInput
  let suggestionsContainer

  beforeEach(() => {
    // Mock scroll function that's not available in JSDOM
    Element.prototype.scroll = jest.fn()

    const $component = renderTestComponent('autocomplete-search', {
      label: {
        text: 'Search me'
      },
      hint: {
        text: 'Search for deployments by name'
      },
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
      '[data-testid="app-autocomplete-search-suggestions"]'
    )
      .first()
      .html()
    document.getElementsByTagName('html')[0].appendChild(scriptElement)

    // Append search component to a form and then add it to the document
    document.body.innerHTML = `<form id="mock-search-form">
        ${$component('[data-testid="app-autocomplete-search-group"]')
          .first()
          .html()}
      </form>`

    // Init ClientSide JavaScript
    const searchComponents = Array.from(
      document.querySelectorAll('[data-js="app-autocomplete-search"]')
    )

    if (searchComponents.length) {
      searchComponents.forEach(($search) => autocompleteSearch($search))
    }

    autocompleteSearchInput = document.querySelector(
      '[data-testid="app-autocomplete-search-input"]'
    )
    suggestionsContainer = document.querySelector(
      '[data-testid="app-autocomplete-search-suggestions"]'
    )
  })

  test('On load should not show suggestions', () => {
    expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
  })

  describe('When clicked', () => {
    beforeEach(() => {
      autocompleteSearchInput.click()
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })

    test('Should contain expected suggestions when input clicked', () => {
      const children = suggestionsContainer.children

      expect(children.length).toEqual(3)

      expect(children[0].textContent).toEqual('cdp-portal-frontend')
      expect(children[1].textContent).toEqual('cdp-self-service-ops')
      expect(children[2].textContent).toEqual('cdp-teams-and-repositories')
    })
  })

  describe('When focussed', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'true'
      )
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
      autocompleteSearchInput.focus()

      const tabKeyEvent = new KeyboardEvent('keydown', { code: 'tab' })
      autocompleteSearchInput.dispatchEvent(tabKeyEvent)
    })

    test('Should close suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When value entered into input', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()
      autocompleteSearchInput.value = 'fro'
      autocompleteSearchInput.dispatchEvent(new Event('input'))
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'true'
      )
    })

    test('Should narrow to expected suggestion', () => {
      expect(suggestionsContainer.children.length).toEqual(1)
      expect(suggestionsContainer.children[0].textContent).toEqual(
        'cdp-portal-frontend'
      )
    })

    test('Should display clear button', () => {
      const clearButton = document.querySelector(
        '[data-testid="app-autocomplete-search-clear-button"]'
      )

      expect(clearButton.getAttribute('aria-hidden')).toEqual('false')
    })
  })

  describe('When value removed from input', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()

      // Add value to input
      autocompleteSearchInput.value = 'fro'
      autocompleteSearchInput.dispatchEvent(new Event('input'))

      // Remove value from input
      autocompleteSearchInput.value = ''
      autocompleteSearchInput.dispatchEvent(new Event('input'))
    })

    test('Suggestions should be open', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'true'
      )
    })

    test('Should contain expected suggestions', () => {
      const children = suggestionsContainer.children

      expect(children.length).toEqual(3)

      expect(children[0].textContent).toEqual('cdp-portal-frontend')
      expect(children[1].textContent).toEqual('cdp-self-service-ops')
      expect(children[2].textContent).toEqual('cdp-teams-and-repositories')
    })

    test('Should not display clear button', () => {
      const clearButton = document.querySelector(
        '[data-testid="app-autocomplete-search-clear-button"]'
      )

      expect(clearButton.getAttribute('aria-hidden')).toEqual('true')
    })
  })

  describe('When value without results entered into input', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()
      autocompleteSearchInput.value = 'blah'
      autocompleteSearchInput.dispatchEvent(new Event('input'))
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'true'
      )
    })

    test('Should provide no results message', () => {
      expect(suggestionsContainer.children.length).toEqual(1)
      expect(suggestionsContainer.children[0].textContent).toEqual('No results')
    })
  })

  describe('When "backspace" pressed in empty input', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()

      const backspaceKeyEvent = new KeyboardEvent('keydown', {
        code: 'backspace'
      })
      autocompleteSearchInput.dispatchEvent(backspaceKeyEvent)
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(autocompleteSearchInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "escape" key pressed', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()

      const escapeKeyEvent = new KeyboardEvent('keydown', {
        code: 'escape'
      })
      autocompleteSearchInput.dispatchEvent(escapeKeyEvent)
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(autocompleteSearchInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "arrow" keys pressed', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()
    })

    test('Once, should highlight first suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      autocompleteSearchInput.dispatchEvent(arrowDownKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('true')
      expect(children[1].getAttribute('aria-selected')).toEqual('false')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })

    test('Twice, should highlight second suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      autocompleteSearchInput.dispatchEvent(arrowDownKeyEvent)
      autocompleteSearchInput.dispatchEvent(arrowDownKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('false')
      expect(children[1].getAttribute('aria-selected')).toEqual('true')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })

    test('Up and Down keys, should highlight expected suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      autocompleteSearchInput.dispatchEvent(arrowDownKeyEvent)
      autocompleteSearchInput.dispatchEvent(arrowDownKeyEvent)
      autocompleteSearchInput.dispatchEvent(arrowDownKeyEvent)

      const arrowUpKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowup'
      })
      autocompleteSearchInput.dispatchEvent(arrowUpKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('false')
      expect(children[1].getAttribute('aria-selected')).toEqual('true')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })
  })

  describe('When "enter" key pressed in suggestions', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()

      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      autocompleteSearchInput.dispatchEvent(arrowDownKeyEvent)

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      autocompleteSearchInput.dispatchEvent(enterKeyEvent)
    })

    test('Should provide expected suggestion value', () => {
      expect(autocompleteSearchInput.value).toEqual('cdp-portal-frontend')
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(autocompleteSearchInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When suggestion is clicked', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()
      suggestionsContainer.children[1].click()
    })

    test('Should provide expected suggestion value', () => {
      expect(autocompleteSearchInput.value).toEqual('cdp-self-service-ops')
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(autocompleteSearchInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "enter" key is pressed with input value', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()

      // Add value to input
      autocompleteSearchInput.value = 'fro'
      autocompleteSearchInput.dispatchEvent(new Event('input'))

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      autocompleteSearchInput.dispatchEvent(enterKeyEvent)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "enter" key is pressed without input value', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()

      const escapeKeyEvent = new KeyboardEvent('keydown', {
        code: 'escape'
      })
      autocompleteSearchInput.dispatchEvent(escapeKeyEvent)

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      autocompleteSearchInput.dispatchEvent(enterKeyEvent)
    })

    test('Suggestions should be open', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'true'
      )
    })
  })

  describe('When element outside of search is clicked', () => {
    beforeEach(() => {
      autocompleteSearchInput.focus()
      document.body.click()
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteSearchInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })
})
