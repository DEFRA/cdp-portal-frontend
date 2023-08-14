import { renderTestComponent } from '~/test-helpers/component-helpers'
import { dropdown } from '~/src/server/common/components/dropdown/dropdown'

describe('#dropdown', () => {
  let dropdownInput
  let chevronButton
  let suggestionsContainer

  beforeEach(() => {
    // Mock scroll function that's not available in JSDOM
    Element.prototype.scroll = jest.fn()

    const $component = renderTestComponent('dropdown', {
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
      '[data-testid="app-dropdown-suggestions"]'
    )
      .first()
      .html()
    document.getElementsByTagName('html')[0].appendChild(scriptElement)

    // Append dropdown component to a form and then add it to the document
    document.body.innerHTML = `<form id="mock-dropdown-form">
        ${$component('[data-testid="app-dropdown-group"]').first().html()}
      </form>`

    // Init ClientSide JavaScript
    const dropdownComponents = Array.from(
      document.querySelectorAll('[data-js="app-dropdown"]')
    )

    if (dropdownComponents.length) {
      dropdownComponents.forEach(($dropdownComponent) =>
        dropdown($dropdownComponent)
      )
    }

    dropdownInput = document.querySelector('[data-testid="app-dropdown-input"]')
    chevronButton = document.querySelector('[data-testid="app-chevron-button"]')
    suggestionsContainer = document.querySelector(
      '[data-testid="app-dropdown-suggestions"]'
    )
  })

  describe('On load', () => {
    test('Should not show suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
    })

    test('Should have enhanced select input', () => {
      expect(dropdownInput.tagName.toLowerCase()).toEqual('input')
    })

    test('Input should have control of suggestions', () => {
      expect(dropdownInput.getAttribute('aria-owns')).toEqual(
        'app-suggestions-user'
      )
    })

    test('Chevron should be in closed position', () => {
      expect(chevronButton.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('When clicked', () => {
    beforeEach(() => {
      dropdownInput.click()
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
      dropdownInput.focus()
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('true')
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
      dropdownInput.focus()

      const tabKeyEvent = new KeyboardEvent('keydown', { code: 'tab' })
      dropdownInput.dispatchEvent(tabKeyEvent)
    })

    test('Should close suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('When partial value', () => {
    describe('Entered into input', () => {
      beforeEach(() => {
        dropdownInput.focus()
        dropdownInput.value = 'abb'
        dropdownInput.dispatchEvent(new Event('input'))
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
        expect(dropdownInput.getAttribute('aria-expanded')).toEqual('true')
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
        dropdownInput.focus()
        dropdownInput.value = 'ro'
        dropdownInput.dispatchEvent(new Event('input'))
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
        expect(dropdownInput.getAttribute('aria-expanded')).toEqual('true')
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
        dropdownInput.focus()
        dropdownInput.value = 'Barb'
        dropdownInput.dispatchEvent(new Event('input'))
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
      dropdownInput.focus()
      dropdownInput.value = 'Barbie'
      dropdownInput.dispatchEvent(new Event('input'))
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
      dropdownInput.focus()

      // Add value to input
      dropdownInput.value = 'fro'
      dropdownInput.dispatchEvent(new Event('input'))

      // Remove value from input
      dropdownInput.value = ''
      dropdownInput.dispatchEvent(new Event('input'))
    })

    test('Suggestions should be open', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('true')
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
      dropdownInput.focus()
      dropdownInput.value = 'blah'
      dropdownInput.dispatchEvent(new Event('input'))
    })

    test('Should open suggestions', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('true')
    })

    test('Should provide no results message', () => {
      expect(suggestionsContainer.children.length).toEqual(1)
      expect(suggestionsContainer.children[0].textContent).toEqual('No results')
    })
  })

  describe('When "backspace" pressed in empty input', () => {
    beforeEach(() => {
      dropdownInput.focus()

      const backspaceKeyEvent = new KeyboardEvent('keydown', {
        code: 'backspace'
      })
      dropdownInput.dispatchEvent(backspaceKeyEvent)
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(dropdownInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('When "escape" key pressed', () => {
    beforeEach(() => {
      dropdownInput.focus()

      const escapeKeyEvent = new KeyboardEvent('keydown', {
        code: 'escape'
      })
      dropdownInput.dispatchEvent(escapeKeyEvent)
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(dropdownInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('When "arrow" keys pressed', () => {
    beforeEach(() => {
      dropdownInput.focus()
    })

    test('Once, should highlight first suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      dropdownInput.dispatchEvent(arrowDownKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('true')
      expect(children[1].getAttribute('aria-selected')).toEqual('false')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })

    test('Twice, should highlight second suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      dropdownInput.dispatchEvent(arrowDownKeyEvent)
      dropdownInput.dispatchEvent(arrowDownKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('false')
      expect(children[1].getAttribute('aria-selected')).toEqual('true')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })

    test('Up and Down keys, should highlight expected suggestion', () => {
      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      dropdownInput.dispatchEvent(arrowDownKeyEvent)
      dropdownInput.dispatchEvent(arrowDownKeyEvent)
      dropdownInput.dispatchEvent(arrowDownKeyEvent)

      const arrowUpKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowup'
      })
      dropdownInput.dispatchEvent(arrowUpKeyEvent)

      const children = suggestionsContainer.children

      expect(children[0].getAttribute('aria-selected')).toEqual('false')
      expect(children[1].getAttribute('aria-selected')).toEqual('true')
      expect(children[2].getAttribute('aria-selected')).toEqual('false')
    })
  })

  describe('When "enter" key pressed in suggestions', () => {
    beforeEach(() => {
      dropdownInput.focus()

      const arrowDownKeyEvent = new KeyboardEvent('keydown', {
        code: 'arrowdown'
      })
      dropdownInput.dispatchEvent(arrowDownKeyEvent)

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      dropdownInput.dispatchEvent(enterKeyEvent)
    })

    test('Should provide expected suggestion value', () => {
      expect(dropdownInput.value).toEqual('RoboCop')
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(dropdownInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('When suggestion is clicked', () => {
    beforeEach(() => {
      dropdownInput.focus()
      suggestionsContainer.children[1].click()
    })

    test('Should provide expected suggestion value', () => {
      expect(dropdownInput.value).toEqual('Roger Rabbit')
    })

    test('Input should keep focus', () => {
      expect(document.activeElement).toEqual(dropdownInput)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('When "enter" key is pressed with input value', () => {
    beforeEach(() => {
      dropdownInput.focus()

      // Add value to input
      dropdownInput.value = 'fro'
      dropdownInput.dispatchEvent(new Event('input'))

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      dropdownInput.dispatchEvent(enterKeyEvent)
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('false')
    })
  })

  describe('When "enter" key is pressed without input value', () => {
    beforeEach(() => {
      dropdownInput.focus()

      const escapeKeyEvent = new KeyboardEvent('keydown', {
        code: 'escape'
      })
      dropdownInput.dispatchEvent(escapeKeyEvent)

      const enterKeyEvent = new KeyboardEvent('keydown', {
        code: 'enter'
      })
      dropdownInput.dispatchEvent(enterKeyEvent)
    })

    test('Suggestions should be open', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('polite')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('true')
    })
  })

  describe('When element outside of dropdown is clicked', () => {
    beforeEach(() => {
      dropdownInput.focus()
      document.body.click()
    })

    test('Suggestions should be closed', () => {
      expect(suggestionsContainer.getAttribute('aria-live')).toEqual('off')
      expect(dropdownInput.getAttribute('aria-expanded')).toEqual('false')
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
