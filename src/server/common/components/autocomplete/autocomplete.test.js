import { renderTestComponent } from '~/test-helpers/component-helpers'
import { Autocomplete } from '~/src/server/common/components/autocomplete/autocomplete'
import { defaultOption } from '~/src/server/common/helpers/options/default-option'
import { dispatchDomContentLoaded } from '~/test-helpers/dispatch-dom-content-loaded'

const basicSuggestions = [
  defaultOption,
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
let autocompleteInput
let chevronButton
let suggestionsContainer

function setupAutoComplete(userSearchParam) {
  if (userSearchParam) {
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        search: `?user=${userSearchParam}`
      }
    })
  }

  const $component = renderTestComponent('autocomplete', {
    label: {
      text: 'By'
    },
    hint: {
      text: 'Choose a user'
    },
    id: 'user',
    name: 'user',
    suggestions: basicSuggestions
  })

  // Add suggestions into the components <script /> tag
  const scriptElement = document.createElement('script')
  scriptElement.innerHTML = $component(
    '[data-testid="app-autocomplete-suggestions"]'
  )
    .first()
    .html()
  document.getElementsByTagName('html')[0].appendChild(scriptElement)

  // Append dropdown component to a form and then add it to the document
  document.body.innerHTML = `<form id="mock-dropdown-form">
        ${$component('[data-testid="app-autocomplete-group"]').first().html()}
      </form>`

  // Init ClientSide JavaScript
  const autocompletes = Array.from(
    document.querySelectorAll('[data-js="app-autocomplete"]')
  )

  if (autocompletes.length) {
    autocompletes.forEach(($autocomplete) => new Autocomplete($autocomplete))
  }

  autocompleteInput = document.querySelector(
    '[data-testid="app-autocomplete-input"]'
  )
  chevronButton = document.querySelector('[data-testid="app-chevron-button"]')
  suggestionsContainer = document.querySelector(
    '[data-testid="app-autocomplete-suggestions"]'
  )

  if (userSearchParam) {
    dispatchDomContentLoaded()
  }
}

describe('#autocomplete', () => {
  describe('Without query param', () => {
    beforeEach(() => {
      setupAutoComplete()
    })

    describe('On load', () => {
      test('Should not show suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
      })

      test('Should have enhanced select input', () => {
        expect(autocompleteInput.tagName.toLowerCase()).toBe('input')
      })

      test('Input should have control of suggestions', () => {
        expect(autocompleteInput.getAttribute('aria-controls')).toBe(
          'app-autocomplete-user-suggestions'
        )
      })

      test('Chevron button should have control of suggestions', () => {
        expect(chevronButton.getAttribute('aria-owns')).toBe(
          'app-autocomplete-user-suggestions'
        )
      })

      test('Chevron should be in closed position', () => {
        expect(chevronButton.getAttribute('aria-label')).toBe('Show')
      })
    })

    describe('When clicked', () => {
      beforeEach(() => {
        autocompleteInput.click()
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('true')
      })

      test('Should contain expected suggestions when input clicked', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(3)

        expect(children[0].textContent).toContain('RoboCop')
        expect(children[1].textContent).toBe('Roger Rabbit')
        expect(children[2].textContent).toBe('Barbie')
      })
    })

    describe('When focussed', () => {
      beforeEach(() => {
        autocompleteInput.focus()
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('true')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('true')
      })

      test('Should contain expected suggestions when input focused', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(3)

        expect(children[0].textContent).toBe('RoboCop')
        expect(children[1].textContent).toBe('Roger Rabbit')
        expect(children[2].textContent).toBe('Barbie')
      })
    })

    describe('When keyboard "tab" key pressed', () => {
      beforeEach(() => {
        autocompleteInput.focus()
        const tabKeyEvent = new KeyboardEvent('keydown', { code: 'tab' })
        autocompleteInput.dispatchEvent(tabKeyEvent)
      })

      test('Should close suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('false')
      })
    })

    describe('When partial value', () => {
      describe('Entered into input', () => {
        beforeEach(() => {
          autocompleteInput.focus()
          autocompleteInput.value = 'abb'
          autocompleteInput.dispatchEvent(new Event('input'))
        })

        test('Should open suggestions', () => {
          expect(suggestionsContainer.getAttribute('aria-expanded')).toBe(
            'true'
          )
          expect(autocompleteInput.getAttribute('aria-expanded')).toBe('true')
        })

        test('Should narrow to only expected suggestion', () => {
          expect(suggestionsContainer.children).toHaveLength(1)
          expect(suggestionsContainer.children[0].textContent).toBe(
            'Roger Rabbit'
          )
        })
      })

      describe('That matches multiple suggestions is entered into input', () => {
        beforeEach(() => {
          autocompleteInput.focus()
          autocompleteInput.value = 'ro'
          autocompleteInput.dispatchEvent(new Event('input'))
        })

        test('Should open suggestions', () => {
          expect(suggestionsContainer.getAttribute('aria-expanded')).toBe(
            'true'
          )
          expect(autocompleteInput.getAttribute('aria-expanded')).toBe('true')
        })

        test('Should narrow to only expected suggestions', () => {
          expect(suggestionsContainer.children).toHaveLength(2)
          expect(suggestionsContainer.children[0].textContent).toBe('RoboCop')
          expect(suggestionsContainer.children[1].textContent).toBe(
            'Roger Rabbit'
          )
        })
      })

      describe('With crazy case value entered into input', () => {
        beforeEach(() => {
          autocompleteInput.focus()
          autocompleteInput.value = 'Barb'
          autocompleteInput.dispatchEvent(new Event('input'))
        })

        test('Should narrow to only expected case insensitive suggestion', () => {
          expect(suggestionsContainer.children).toHaveLength(1)
          expect(suggestionsContainer.children[0].textContent.trim()).toBe(
            'Barbie'
          )
        })
      })
    })

    describe('With exact match entered into input', () => {
      beforeEach(() => {
        autocompleteInput.focus()
        autocompleteInput.value = 'Barbie'
        autocompleteInput.dispatchEvent(new Event('input'))
      })

      test('Should show all suggestions', () => {
        expect(suggestionsContainer.children).toHaveLength(3)
      })

      test('Should highlight matched suggestion', () => {
        const matchedSuggestion = Array.from(
          suggestionsContainer.children
        ).find((suggestion) => suggestion.dataset.isMatch === 'true')

        expect(matchedSuggestion.textContent.trim()).toBe('Barbie')
      })
    })

    describe('When value removed from input', () => {
      beforeEach(() => {
        autocompleteInput.focus()

        // Add value to input
        autocompleteInput.value = 'fro'
        autocompleteInput.dispatchEvent(new Event('input'))

        // Remove value from input
        autocompleteInput.value = ''
        autocompleteInput.dispatchEvent(new Event('input'))
      })

      test('Suggestions should be open', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('true')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('true')
      })

      test('Should contain expected suggestions', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(3)

        expect(children[0].textContent).toBe('RoboCop')
        expect(children[1].textContent).toBe('Roger Rabbit')
        expect(children[2].textContent).toBe('Barbie')
      })
    })

    describe('When value without results entered into input', () => {
      beforeEach(() => {
        autocompleteInput.focus()
        autocompleteInput.value = 'blah'
        autocompleteInput.dispatchEvent(new Event('input'))
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('true')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('true')
      })

      test('Should provide no results message', () => {
        expect(suggestionsContainer.children).toHaveLength(1)
        expect(suggestionsContainer.children[0].textContent).toBe(
          ' - - no result - - '
        )
      })
    })

    describe('When "backspace" pressed in empty input', () => {
      beforeEach(() => {
        autocompleteInput.focus()
        autocompleteInput.value = ''

        const backspaceKeyEvent = new KeyboardEvent('keydown', {
          code: 'backspace'
        })
        autocompleteInput.dispatchEvent(backspaceKeyEvent)
      })

      test('Input should keep focus', () => {
        expect(document.activeElement).toBe(autocompleteInput)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('false')
      })
    })

    describe('When keyboard "escape" key pressed', () => {
      beforeEach(() => {
        autocompleteInput.focus()

        const escapeKeyEvent = new KeyboardEvent('keydown', {
          code: 'escape'
        })
        autocompleteInput.dispatchEvent(escapeKeyEvent)
      })

      test('Input should keep focus', () => {
        expect(document.activeElement).toBe(autocompleteInput)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('false')
      })
    })

    describe('When keyboard "arrow" keys pressed', () => {
      beforeEach(() => {
        autocompleteInput.focus()
      })

      test('Once, should highlight first suggestion', () => {
        const arrowDownKeyEvent = new KeyboardEvent('keydown', {
          code: 'arrowdown'
        })
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)

        const children = suggestionsContainer.children

        expect(children[0].dataset.hasHighlight).toBe('true')
        expect(children[1].dataset.hasHighlight).toBe('false')
        expect(children[2].dataset.hasHighlight).toBe('false')

        expect(autocompleteInput.getAttribute('aria-activedescendant')).toBe(
          'app-autocomplete-user-suggestion-1'
        )
      })

      test('Twice, should have expected suggestion position information', () => {
        const arrowDownKeyEvent = new KeyboardEvent('keydown', {
          code: 'arrowdown'
        })
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)

        const children = suggestionsContainer.children

        expect(children[0].dataset.hasHighlight).toBe('false')
        expect(children[1].dataset.hasHighlight).toBe('true')
        expect(children[2].dataset.hasHighlight).toBe('false')

        expect(autocompleteInput.getAttribute('aria-activedescendant')).toBe(
          'app-autocomplete-user-suggestion-2'
        )
      })

      test('Up and Down keys, should highlight expected suggestion', () => {
        const arrowDownKeyEvent = new KeyboardEvent('keydown', {
          code: 'arrowdown'
        })
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)

        const arrowUpKeyEvent = new KeyboardEvent('keydown', {
          code: 'arrowup'
        })
        autocompleteInput.dispatchEvent(arrowUpKeyEvent)
        autocompleteInput.dispatchEvent(arrowUpKeyEvent)

        const children = suggestionsContainer.children

        expect(children[0].dataset.hasHighlight).toBe('true')
        expect(children[1].dataset.hasHighlight).toBe('false')
        expect(children[2].dataset.hasHighlight).toBe('false')

        expect(autocompleteInput.getAttribute('aria-activedescendant')).toBe(
          'app-autocomplete-user-suggestion-1'
        )
      })
    })

    describe('When keyboard "enter" key pressed in suggestions', () => {
      beforeEach(() => {
        autocompleteInput.focus()

        const arrowDownKeyEvent = new KeyboardEvent('keydown', {
          code: 'arrowdown'
        })
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)

        const enterKeyEvent = new KeyboardEvent('keydown', {
          code: 'enter'
        })
        autocompleteInput.dispatchEvent(enterKeyEvent)
      })

      test('Should provide expected suggestion value', () => {
        expect(autocompleteInput.value).toBe('Roger Rabbit')
      })

      test('Input should keep focus', () => {
        expect(document.activeElement).toBe(autocompleteInput)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('false')
      })

      test('Should have correct aria activedescendant value', () => {
        expect(autocompleteInput.getAttribute('aria-activedescendant')).toBe(
          'app-autocomplete-user-suggestion-2'
        )
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children
        expect(children[0].getAttribute('aria-posinset')).toBe('1')
        expect(children[1].getAttribute('aria-posinset')).toBe('2')
        expect(children[2].getAttribute('aria-posinset')).toBe('3')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children
        expect(children[0].getAttribute('aria-selected')).toBe('false')
        expect(children[1].getAttribute('aria-selected')).toBe('true')
        expect(children[2].getAttribute('aria-selected')).toBe('false')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0].getAttribute('aria-setsize')).toBe('4')
        expect(children[1].getAttribute('aria-setsize')).toBe('4')
        expect(children[2].getAttribute('aria-setsize')).toBe('4')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.isMatch).toBe('false')
        expect(firstChild.dataset.value).toBe('RoboCop')
        expect(firstChild.dataset.text).toBe('RoboCop')
        expect(firstChild.dataset.hasHighlight).toBe('false')

        const secondChild = children[1]
        expect(secondChild.dataset.isMatch).toBe('true')
        expect(secondChild.dataset.value).toBe('Roger Rabbit')
        expect(secondChild.dataset.text).toBe('Roger Rabbit')
        expect(secondChild.dataset.hasHighlight).toBe('true')

        const thirdChild = children[2]
        expect(thirdChild.dataset.isMatch).toBe('false')
        expect(thirdChild.dataset.value).toBe('Barbie')
        expect(thirdChild.dataset.text).toBe('Barbie')
        expect(thirdChild.dataset.hasHighlight).toBe('false')
      })
    })

    describe('When suggestion is clicked', () => {
      beforeEach(() => {
        autocompleteInput.focus()
        suggestionsContainer.children[2].click()
      })

      test('Should provide expected suggestion value', () => {
        expect(autocompleteInput.value).toBe('Barbie')
      })

      test('Input should keep focus', () => {
        expect(document.activeElement).toBe(autocompleteInput)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('false')
      })

      test('Should have correct aria activedescendant value', () => {
        expect(autocompleteInput.getAttribute('aria-activedescendant')).toBe(
          'app-autocomplete-user-suggestion-3'
        )
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children
        expect(children[0].getAttribute('aria-posinset')).toBe('1')
        expect(children[1].getAttribute('aria-posinset')).toBe('2')
        expect(children[2].getAttribute('aria-posinset')).toBe('3')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children
        expect(children[0].getAttribute('aria-selected')).toBe('false')
        expect(children[1].getAttribute('aria-selected')).toBe('false')
        expect(children[2].getAttribute('aria-selected')).toBe('true')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0].getAttribute('aria-setsize')).toBe('4')
        expect(children[1].getAttribute('aria-setsize')).toBe('4')
        expect(children[2].getAttribute('aria-setsize')).toBe('4')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.isMatch).toBe('false')
        expect(firstChild.dataset.value).toBe('RoboCop')
        expect(firstChild.dataset.text).toBe('RoboCop')
        expect(firstChild.dataset.hasHighlight).toBe('false')

        const secondChild = children[1]
        expect(secondChild.dataset.isMatch).toBe('false')
        expect(secondChild.dataset.value).toBe('Roger Rabbit')
        expect(secondChild.dataset.text).toBe('Roger Rabbit')
        expect(secondChild.dataset.hasHighlight).toBe('false')

        const thirdChild = children[2]
        expect(thirdChild.dataset.isMatch).toBe('true')
        expect(thirdChild.dataset.value).toBe('Barbie')
        expect(thirdChild.dataset.text).toBe('Barbie')
        expect(thirdChild.dataset.hasHighlight).toBe('true')
      })
    })

    describe('When keyboard "enter" key is pressed with input value', () => {
      beforeEach(() => {
        autocompleteInput.focus()

        // Add value to input
        autocompleteInput.value = 'fro'
        autocompleteInput.dispatchEvent(new Event('input'))

        const enterKeyEvent = new KeyboardEvent('keydown', {
          code: 'enter'
        })
        autocompleteInput.dispatchEvent(enterKeyEvent)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('false')
      })
    })

    describe('When keyboard "enter" key is pressed with matching input value', () => {
      beforeEach(() => {
        autocompleteInput.focus()

        // Add value to input
        autocompleteInput.value = 'RoboCop'
        autocompleteInput.dispatchEvent(new Event('input'))

        const enterKeyEvent = new KeyboardEvent('keydown', {
          code: 'enter'
        })
        autocompleteInput.dispatchEvent(enterKeyEvent)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('false')
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children
        expect(children[0].getAttribute('aria-posinset')).toBe('1')
        expect(children[1].getAttribute('aria-posinset')).toBe('2')
        expect(children[2].getAttribute('aria-posinset')).toBe('3')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children
        expect(children[0].getAttribute('aria-selected')).toBe('true')
        expect(children[1].getAttribute('aria-selected')).toBe('false')
        expect(children[2].getAttribute('aria-selected')).toBe('false')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0].getAttribute('aria-setsize')).toBe('4')
        expect(children[1].getAttribute('aria-setsize')).toBe('4')
        expect(children[2].getAttribute('aria-setsize')).toBe('4')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.isMatch).toBe('true')
        expect(firstChild.dataset.value).toBe('RoboCop')
        expect(firstChild.dataset.text).toBe('RoboCop')

        const secondChild = children[1]
        expect(secondChild.dataset.isMatch).toBe('false')
        expect(secondChild.dataset.value).toBe('Roger Rabbit')
        expect(secondChild.dataset.text).toBe('Roger Rabbit')

        const thirdChild = children[2]
        expect(thirdChild.dataset.isMatch).toBe('false')
        expect(thirdChild.dataset.value).toBe('Barbie')
        expect(thirdChild.dataset.text).toBe('Barbie')
      })

      test('suggestions Should not have highlight data attributes', () => {
        const children = suggestionsContainer.children

        expect(children[0].dataset.hasHighlight).toBe('false')
        expect(children[1].dataset.hasHighlight).toBe('false')
        expect(children[2].dataset.hasHighlight).toBe('false')
      })
    })

    describe('When keyboard "enter" key is pressed without input value', () => {
      beforeEach(() => {
        autocompleteInput.focus()
        autocompleteInput.value = ''

        const escapeKeyEvent = new KeyboardEvent('keydown', {
          code: 'escape'
        })
        autocompleteInput.dispatchEvent(escapeKeyEvent)

        const enterKeyEvent = new KeyboardEvent('keydown', {
          code: 'enter'
        })
        autocompleteInput.dispatchEvent(enterKeyEvent)
      })

      test('Suggestions should be open', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('true')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('true')
      })
    })

    describe('When element outside of dropdown is clicked', () => {
      beforeEach(() => {
        autocompleteInput.focus()
        document.body.click()
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
        expect(autocompleteInput.getAttribute('aria-expanded')).toBe('false')
      })
    })

    describe('When "chevron" button is pressed', () => {
      test('Once, should open suggestions', () => {
        chevronButton.click()

        expect(chevronButton.getAttribute('aria-label')).toBe('Hide')
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('true')
      })

      test('Twice, should close suggestions', () => {
        chevronButton.click()
        chevronButton.click()

        expect(chevronButton.getAttribute('aria-label')).toBe('Show')
        expect(suggestionsContainer.getAttribute('aria-expanded')).toBe('false')
      })
    })
  })

  describe('With query param', () => {
    beforeEach(() => {
      setupAutoComplete('Barbie')
    })

    describe('On load with query param', () => {
      test('Should have correct aria activedescendant value', () => {
        expect(autocompleteInput.getAttribute('aria-activedescendant')).toBe(
          'app-autocomplete-user-suggestion-3'
        )
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children
        expect(children[0].getAttribute('aria-posinset')).toBe('1')
        expect(children[1].getAttribute('aria-posinset')).toBe('2')
        expect(children[2].getAttribute('aria-posinset')).toBe('3')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children
        expect(children[0].getAttribute('aria-selected')).toBe('false')
        expect(children[1].getAttribute('aria-selected')).toBe('false')
        expect(children[2].getAttribute('aria-selected')).toBe('true')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0].getAttribute('aria-setsize')).toBe('4')
        expect(children[1].getAttribute('aria-setsize')).toBe('4')
        expect(children[2].getAttribute('aria-setsize')).toBe('4')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.isMatch).toBe('false')
        expect(firstChild.dataset.value).toBe('RoboCop')
        expect(firstChild.dataset.text).toBe('RoboCop')
        expect(firstChild.dataset.hasHighlight).toBe('false')

        const secondChild = children[1]
        expect(secondChild.dataset.isMatch).toBe('false')
        expect(secondChild.dataset.value).toBe('Roger Rabbit')
        expect(secondChild.dataset.text).toBe('Roger Rabbit')
        expect(secondChild.dataset.hasHighlight).toBe('false')

        const thirdChild = children[2]
        expect(thirdChild.dataset.isMatch).toBe('true')
        expect(thirdChild.dataset.value).toBe('Barbie')
        expect(thirdChild.dataset.text).toBe('Barbie')
        expect(thirdChild.dataset.hasHighlight).toBe('true')
      })
    })
  })
})
