import { renderTestComponent } from '~/test-helpers/component-helpers'
import { autocompleteDropdown } from '~/src/server/common/components/autocomplete-dropdown/autocomplete-dropdown'

describe('#autocompleteDropdown', () => {
  let autocompleteDropdownInput
  let chevronButton
  let suggestionsContainer

  beforeEach(() => {
    // Mock scroll function that's not available in JSDOM
    Element.prototype.scroll = jest.fn()

    const $component = renderTestComponent('autocomplete-dropdown', {
      label: {
        text: 'By'
      },
      hint: {
        text: 'Choose a user'
      },
      id: 'user',
      name: 'user',
      suggestions: [
        {
          text: 'RoboCop',
          value: 'RoboCop'
        },
        {
          text: 'Roger Rabbit',
          value: 'Roger Rabbit'
        },
        {
          text: 'Barbie',
          value: 'Barbie'
        }
      ]
    })

    // Add suggestions
    const scriptElement = document.createElement('script')
    scriptElement.innerHTML = $component(
      '[data-testid="app-autocomplete-dropdown-suggestions"]'
    )
      .first()
      .html()
    document.getElementsByTagName('html')[0].appendChild(scriptElement)

    // Append dropdown component to a form and then add it to the document
    document.body.innerHTML = `<form id="mock-dropdown-form">
        ${$component('[data-testid="app-autocomplete-dropdown-group"]')
          .first()
          .html()}
      </form>`

    // Init ClientSide JavaScript
    const dropdownComponents = Array.from(
      document.querySelectorAll('[data-js="app-autocomplete-dropdown"]')
    )

    if (dropdownComponents.length) {
      dropdownComponents.forEach(($dropdownComponent) =>
        autocompleteDropdown($dropdownComponent)
      )
    }

    autocompleteDropdownInput = document.querySelector(
      '[data-testid="app-autocomplete-dropdown-input"]'
    )
    chevronButton = document.querySelector('[data-testid="app-chevron-button"]')
    suggestionsContainer = document.querySelector(
      '[data-testid="app-autocomplete-dropdown-suggestions"]'
    )
  })

  describe('On load', () => {
    test('Should not show suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })

    test('Should have enhanced select input', () => {
      expect(autocompleteDropdownInput.tagName.toLowerCase()).toEqual('input')
    })

    test('Input should have control of suggestions', () => {
      expect(autocompleteDropdownInput.getAttribute('aria-owns')).toEqual(
        'app-suggestions-user'
      )
    })

    test('Chevron should be in closed position', () => {
      expect(chevronButton.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('When clicked', () => {
    beforeEach(() => {
      autocompleteDropdownInput.click()
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })

    test('Should contain expected suggestions when input clicked', () => {
      const children = suggestionsContainer.children

      expect(children.length).toEqual(3)

      expect(children[0].textContent).toEqual('RoboCop')
      expect(children[1].textContent).toEqual('Roger Rabbit')
      expect(children[2].textContent).toEqual('Barbie')
    })
  })

  describe('When focussed', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'true'
      )
    })

    test('Should contain expected suggestions when input focused', () => {
      const children = suggestionsContainer.children

      expect(children.length).toEqual(3)

      expect(children[0].textContent).toEqual('RoboCop')
      expect(children[1].textContent).toEqual('Roger Rabbit')
      expect(children[2].textContent).toEqual('Barbie')
    })
  })

  describe('When "tab" key pressed', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()

      const tabKeyEvent = new KeyboardEvent('keydown', { code: 'tab' })
      autocompleteDropdownInput.dispatchEvent(tabKeyEvent)
    })

    test('Should close suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When partial value', () => {
    describe('Entered into input', () => {
      beforeEach(() => {
        autocompleteDropdownInput.focus()
        autocompleteDropdownInput.value = 'abb'
        autocompleteDropdownInput.dispatchEvent(new Event('input'))
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
        expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
          'true'
        )
      })

      test('Should narrow to only expected suggestion', () => {
        expect(suggestionsContainer.children.length).toEqual(1)
        expect(suggestionsContainer.children[0].textContent).toEqual(
          'Roger Rabbit'
        )
      })
    })

    describe('That matches multiple suggestions is entered into input', () => {
      beforeEach(() => {
        autocompleteDropdownInput.focus()
        autocompleteDropdownInput.value = 'ro'
        autocompleteDropdownInput.dispatchEvent(new Event('input'))
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
        expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
          'true'
        )
      })

      test('Should narrow to only expected suggestions', () => {
        expect(suggestionsContainer.children.length).toEqual(2)
        expect(suggestionsContainer.children[0].textContent).toEqual('RoboCop')
        expect(suggestionsContainer.children[1].textContent).toEqual(
          'Roger Rabbit'
        )
      })
    })

    describe('With crazy case value entered into input', () => {
      beforeEach(() => {
        autocompleteDropdownInput.focus()
        autocompleteDropdownInput.value = 'Barb'
        autocompleteDropdownInput.dispatchEvent(new Event('input'))
      })

      test('Should narrow to only expected case insensitive suggestion', () => {
        expect(suggestionsContainer.children.length).toEqual(1)
        expect(suggestionsContainer.children[0].textContent.trim()).toEqual(
          'Barbie'
        )
      })
    })
  })

  describe('With exact match entered into input', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()
      autocompleteDropdownInput.value = 'Barbie'
      autocompleteDropdownInput.dispatchEvent(new Event('input'))
    })

    test('Should show all suggestions', () => {
      expect(suggestionsContainer.children.length).toEqual(3)
    })

    test('Should highlight matched suggestion', () => {
      const matchedSuggestion = Array.from(suggestionsContainer.children).find(
        (suggestion) => suggestion.dataset.isMatch === 'true'
      )

      expect(matchedSuggestion.textContent.trim()).toEqual('Barbie')
      expect(matchedSuggestion.children[1].innerHTML).toContain('app-tick-icon')
    })
  })

  describe('When value removed from input', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()

      // Add value to input
      autocompleteDropdownInput.value = 'fro'
      autocompleteDropdownInput.dispatchEvent(new Event('input'))

      // Remove value from input
      autocompleteDropdownInput.value = ''
      autocompleteDropdownInput.dispatchEvent(new Event('input'))
    })

    test('Suggestions should be open', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'true'
      )
    })

    test('Should contain expected suggestions', () => {
      const children = suggestionsContainer.children

      expect(children.length).toEqual(3)

      expect(children[0].textContent).toEqual('RoboCop')
      expect(children[1].textContent).toEqual('Roger Rabbit')
      expect(children[2].textContent).toEqual('Barbie')
    })
  })

  describe('When value without results entered into input', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()
      autocompleteDropdownInput.value = 'blah'
      autocompleteDropdownInput.dispatchEvent(new Event('input'))
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
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
      autocompleteDropdownInput.focus()

      const backspaceKeyEvent = new KeyboardEvent('keydown', {
        code: 'backspace'
      })
      autocompleteDropdownInput.dispatchEvent(backspaceKeyEvent)
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(autocompleteDropdownInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "escape" key pressed', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()

      const escapeKeyEvent = new KeyboardEvent('keydown', {
        code: 'escape'
      })
      autocompleteDropdownInput.dispatchEvent(escapeKeyEvent)
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(autocompleteDropdownInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "arrow" keys pressed', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()
    })

    test('Once, should highlight first suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      autocompleteDropdownInput.dispatchEvent(arrowDownKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('true')
      expect(children[1].getAttribute('aria-selected')).toEqual('false')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })

    test('Twice, should highlight second suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      autocompleteDropdownInput.dispatchEvent(arrowDownKeyEvent)
      autocompleteDropdownInput.dispatchEvent(arrowDownKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('false')
      expect(children[1].getAttribute('aria-selected')).toEqual('true')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })

    test('Up and Down keys, should highlight expected suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      autocompleteDropdownInput.dispatchEvent(arrowDownKeyEvent)
      autocompleteDropdownInput.dispatchEvent(arrowDownKeyEvent)
      autocompleteDropdownInput.dispatchEvent(arrowDownKeyEvent)

      const arrowUpKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowup'
      })
      autocompleteDropdownInput.dispatchEvent(arrowUpKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('false')
      expect(children[1].getAttribute('aria-selected')).toEqual('true')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })
  })

  describe('When "enter" key pressed in suggestions', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()

      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      autocompleteDropdownInput.dispatchEvent(arrowDownKeyEvent)

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      autocompleteDropdownInput.dispatchEvent(enterKeyEvent)
    })

    test('Should provide expected suggestion value', () => {
      expect(autocompleteDropdownInput.value).toEqual('RoboCop')
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(autocompleteDropdownInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When suggestion is clicked', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()
      suggestionsContainer.children[1].click()
    })

    test('Should provide expected suggestion value', () => {
      expect(autocompleteDropdownInput.value).toEqual('Roger Rabbit')
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(autocompleteDropdownInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "enter" key is pressed with input value', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()

      // Add value to input
      autocompleteDropdownInput.value = 'fro'
      autocompleteDropdownInput.dispatchEvent(new Event('input'))

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      autocompleteDropdownInput.dispatchEvent(enterKeyEvent)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "enter" key is pressed without input value', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()

      const escapeKeyEvent = new KeyboardEvent('keydown', {
        code: 'escape'
      })
      autocompleteDropdownInput.dispatchEvent(escapeKeyEvent)

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      autocompleteDropdownInput.dispatchEvent(enterKeyEvent)
    })

    test('Suggestions should be open', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'true'
      )
    })
  })

  describe('When element outside of dropdown is clicked', () => {
    beforeEach(() => {
      autocompleteDropdownInput.focus()
      document.body.click()
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(autocompleteDropdownInput.getAttribute('aria-expanded')).toEqual(
        'false'
      )
    })
  })

  describe('When "chevron" button is pressed', () => {
    test('Once, should open suggestions', () => {
      chevronButton.click()

      expect(chevronButton.getAttribute('aria-expanded')).toEqual('true')
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
    })

    test('Twice, should close suggestions', () => {
      chevronButton.click()
      chevronButton.click()

      expect(chevronButton.getAttribute('aria-expanded')).toEqual('false')
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })
  })
})
