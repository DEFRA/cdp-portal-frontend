import { beforeEach, describe, expect, test } from 'vitest'
import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { AutocompleteAdvanced } from './autocomplete-advanced.js'
import { publish } from '../../../../client/common/helpers/event-emitter.js'
import { defaultOption } from '../../helpers/options/default-option.js'
import { enterValue, pressEnter } from '../../../../../test-helpers/keyboard.js'
import { injectAndRunScript } from '../../../../../test-helpers/inject-and-run-script.js'

describe('#autocomplete-advanced', () => {
  let autocompleteInput
  let chevronButton
  let suggestionsContainer

  function setupAdvancedAutoComplete(params) {
    const $component = renderTestComponent('autocomplete', params)
    const js = $component('[data-testid="app-autocomplete-suggestions"]')
      .first()
      .text()

    injectAndRunScript(js)

    // Append dropdown component to a form and then add it to the document
    document.body.innerHTML = `<form id="mock-dropdown-form">
        ${$component('[data-testid="app-autocomplete-group"]').first().html()}
      </form>`

    // Init ClientSide JavaScript
    const autocompletes = Array.from(
      document.querySelectorAll('[data-js="app-autocomplete-advanced"]')
    )

    if (autocompletes.length) {
      autocompletes.forEach(
        ($autocomplete) => new AutocompleteAdvanced($autocomplete)
      )
    }

    autocompleteInput = document.querySelector(
      '[data-testid="app-autocomplete-input"]'
    )
    chevronButton = document.querySelector('[data-testid="app-chevron-button"]')
    suggestionsContainer = document.querySelector(
      '[data-testid="app-autocomplete-suggestions"]'
    )
  }

  describe('With suggestions', () => {
    beforeEach(() => {
      const advancedSuggestions = [
        defaultOption,
        {
          text: 'RoboCop',
          value: 'RoboCop',
          hint: 'User Id: 12454878'
        },
        {
          text: 'Roger Rabbit',
          value: 'Roger Rabbit',
          hint: 'User Id: 556456465'
        },
        {
          text: 'Barbie',
          value: 'Barbie',
          hint: 'User Id: 67567576'
        }
      ]

      setupAdvancedAutoComplete({
        label: {
          text: 'By'
        },
        hint: {
          text: 'Choose a user'
        },
        id: 'user',
        name: 'user',
        template: 'advanced',
        noSuggestionsMessage: 'choose Image name',
        suggestions: advancedSuggestions
      })
    })

    describe('On load', () => {
      test('Should not show suggestions', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
      })

      test('Should have enhanced select input', () => {
        expect(autocompleteInput.tagName.toLowerCase()).toBe('input')
      })

      test('Input should have control of suggestions', () => {
        expect(autocompleteInput).toHaveAttribute(
          'aria-controls',
          'app-autocomplete-user-suggestions'
        )
      })

      test('Chevron button should have control of suggestions', () => {
        expect(chevronButton).toHaveAttribute(
          'aria-owns',
          'app-autocomplete-user-suggestions'
        )
      })

      test('Chevron should be in closed position', () => {
        expect(chevronButton).toHaveAttribute('aria-label', 'Show')
      })
    })

    describe('When clicked', () => {
      beforeEach(() => {
        autocompleteInput.click()
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
      })

      test('Should contain expected suggestions', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(3)

        expect(children[0]).toHaveTextContent(/RoboCopUser Id: 12454878/)
        expect(children[1]).toHaveTextContent('Roger RabbitUser Id: 556456465')
        expect(children[2]).toHaveTextContent('BarbieUser Id: 67567576')
      })
    })

    describe('When focussed', () => {
      beforeEach(() => {
        autocompleteInput.focus()
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
      })

      test('Should contain expected suggestions when input focused', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(3)

        expect(children[0]).toHaveTextContent('RoboCopUser Id: 12454878')
        expect(children[1]).toHaveTextContent('Roger RabbitUser Id: 556456465')
        expect(children[2]).toHaveTextContent('BarbieUser Id: 67567576')
      })
    })

    describe('When keyboard "tab" key pressed', () => {
      beforeEach(() => {
        autocompleteInput.focus()

        const tabKeyEvent = new KeyboardEvent('keydown', { code: 'tab' })
        autocompleteInput.dispatchEvent(tabKeyEvent)
      })

      test('Should close suggestions', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
      })
    })

    describe('When partial value', () => {
      describe('Entered into input', () => {
        beforeEach(() => {
          enterValue(autocompleteInput, 'abb')
        })

        test('Should open suggestions', () => {
          expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
          expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
        })

        test('Should narrow to only expected suggestion', () => {
          expect(suggestionsContainer.children).toHaveLength(1)
          expect(suggestionsContainer.children[0]).toHaveTextContent(
            'Roger RabbitUser Id: 556456465'
          )
        })
      })

      describe('That matches multiple suggestions is entered into input', () => {
        beforeEach(() => {
          enterValue(autocompleteInput, 'ro')
        })

        test('Should open suggestions', () => {
          expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
          expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
        })

        test('Should narrow to only expected suggestions', () => {
          expect(suggestionsContainer.children).toHaveLength(2)
          expect(suggestionsContainer.children[0]).toHaveTextContent(
            'RoboCopUser Id: 12454878'
          )
          expect(suggestionsContainer.children[1]).toHaveTextContent(
            'Roger RabbitUser Id: 556456465'
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
            'BarbieUser Id: 67567576'
          )
        })
      })
    })

    describe('With exact match entered into input', () => {
      beforeEach(() => {
        enterValue(autocompleteInput, 'Barbie')
      })

      test('Should show selected suggestions', () => {
        expect(suggestionsContainer.children).toHaveLength(1)
      })

      test('Should highlight matched suggestion', () => {
        const matchedSuggestion = Array.from(
          suggestionsContainer.children
        ).find((suggestion) => suggestion.dataset.isMatch === 'true')

        expect(matchedSuggestion.textContent.trim()).toBe(
          'BarbieUser Id: 67567576'
        )
        expect(matchedSuggestion.children[2].innerHTML).toContain(
          'app-tick-icon'
        )
      })
    })

    describe('With hint text entered into input', () => {
      beforeEach(() => {
        enterValue(autocompleteInput, 'Id: 556')
        suggestionsContainer.children[0].click()
      })

      test('Should have selected expected suggestion', () => {
        expect(autocompleteInput.value).toBe('Roger Rabbit')
      })

      test('Should have selected expected matched suggestion', () => {
        // Open suggestions
        autocompleteInput.click()

        const matchedSuggestion = Array.from(
          suggestionsContainer.children
        ).find((suggestion) => suggestion.dataset.isMatch === 'true')

        expect(matchedSuggestion.textContent.trim()).toBe(
          'Roger RabbitUser Id: 556456465'
        )
        expect(matchedSuggestion.children[2].innerHTML).toContain(
          'app-tick-icon'
        )
      })
    })

    describe('When value removed from input', () => {
      beforeEach(() => {
        // Add value to input
        enterValue(autocompleteInput, 'fro')

        // Remove value from input
        enterValue(autocompleteInput, '')
      })

      test('Suggestions should be open', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
      })

      test('Should contain expected suggestions', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(3)

        expect(children[0]).toHaveTextContent('RoboCopUser Id: 12454878')
        expect(children[1]).toHaveTextContent('Roger RabbitUser Id: 556456465')
        expect(children[2]).toHaveTextContent('BarbieUser Id: 67567576')
      })
    })

    describe('When value without results entered into input', () => {
      beforeEach(() => {
        enterValue(autocompleteInput, 'blah')
      })

      test('Should open suggestions', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
      })

      test('Should provide no results message', () => {
        expect(suggestionsContainer.children).toHaveLength(1)
        expect(suggestionsContainer.children[0]).toHaveTextContent(
          ` - - no results - - `.trim()
        )
      })
    })

    describe('When no results message is clicked', () => {
      beforeEach(() => {
        enterValue(autocompleteInput, 'ranDom')
        suggestionsContainer.children[0].click()
      })

      test('Should not alter autocomplete value suggestions', () => {
        expect(autocompleteInput.value).toBe('ranDom')
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
        expect(autocompleteInput).toHaveFocus()
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
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
        expect(autocompleteInput).toHaveFocus()
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
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

        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
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

        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
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

        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
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

        pressEnter(autocompleteInput)
      })

      test('Should provide expected suggestion value', () => {
        expect(autocompleteInput.value).toBe('Roger Rabbit')
      })

      test('Input should keep focus', () => {
        expect(autocompleteInput).toHaveFocus()
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
      })

      test('Should have correct aria activedescendant value', () => {
        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
          'app-autocomplete-user-suggestion-2'
        )
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-posinset', '2')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-selected', 'true')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-setsize', '4')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children

        const firstChild = children[0]
        expect(firstChild.dataset.isMatch).toBe('true')
        expect(firstChild.dataset.value).toBe('Roger Rabbit')
        expect(firstChild.dataset.text).toBe('Roger Rabbit')
        expect(firstChild.dataset.hint).toBe('User Id: 556456465')
        expect(firstChild.dataset.hasHighlight).toBe('false')
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
        expect(autocompleteInput).toHaveFocus()
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
      })

      test('Should have correct aria activedescendant value', () => {
        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
          'app-autocomplete-user-suggestion-3'
        )
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children
        expect(children[0]).toHaveAttribute('aria-posinset', '3')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children
        expect(children[0]).toHaveAttribute('aria-selected', 'true')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-setsize', '4')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.isMatch).toBe('true')
        expect(firstChild.dataset.value).toBe('Barbie')
        expect(firstChild.dataset.text).toBe('Barbie')
        expect(firstChild.dataset.hasHighlight).toBe('false')
      })
    })

    describe('When keyboard "enter" key is pressed with input value', () => {
      beforeEach(() => {
        enterValue(autocompleteInput, 'fro')
        pressEnter(autocompleteInput)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
      })
    })

    describe('When keyboard "enter" key is pressed with matching input value', () => {
      beforeEach(() => {
        enterValue(autocompleteInput, 'RoboCop')
        pressEnter(autocompleteInput)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-posinset', '1')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-selected', 'true')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-setsize', '4')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.isMatch).toBe('true')
        expect(firstChild.dataset.value).toBe('RoboCop')
        expect(firstChild.dataset.text).toBe('RoboCop')
      })

      test('suggestions Should not have highlight data attributes', () => {
        const children = suggestionsContainer.children

        expect(children[0].dataset.hasHighlight).toBe('false')
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

        pressEnter(autocompleteInput)
      })

      test('Suggestions should be open', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
      })
    })

    describe('When element outside of dropdown is clicked', () => {
      beforeEach(() => {
        autocompleteInput.focus()
        document.body.click()
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
      })
    })

    describe('When "chevron" button is pressed', () => {
      test('Once, should open suggestions', () => {
        chevronButton.click()

        expect(chevronButton).toHaveAttribute('aria-label', 'Hide')
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
      })

      test('Twice, should close suggestions', () => {
        chevronButton.click()
        chevronButton.click()

        expect(chevronButton).toHaveAttribute('aria-label', 'Show')
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
      })
    })
  })

  describe('Without suggestions', () => {
    beforeEach(() => {
      setupAdvancedAutoComplete({
        label: {
          text: 'By'
        },
        hint: {
          text: 'Choose a user'
        },
        id: 'user',
        name: 'user',
        template: 'advanced',
        noSuggestionsMessage: 'choose Image name',
        suggestions: []
      })
    })

    describe('When clicked', () => {
      beforeEach(() => {
        autocompleteInput.click()
      })

      test('Should contain expected no suggestions message', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(1)

        expect(children[0]).toHaveTextContent('- - choose Image name - -')
      })
    })

    describe('When no suggestions message clicked', () => {
      beforeEach(() => {
        autocompleteInput.click()
        suggestionsContainer.children[0].click()
      })

      test('Should not change value', () => {
        expect(autocompleteInput.value).toBe('')
      })
    })
  })

  describe('When subscribed to a publisher', () => {
    const mockPublisher = 'mock:publisher'

    beforeEach(() => {
      setupAdvancedAutoComplete({
        label: {
          text: 'By'
        },
        hint: {
          text: 'Choose a user'
        },
        id: 'user',
        name: 'user',
        template: 'advanced',
        subscribeTo: mockPublisher,
        noSuggestionsMessage: 'choose Image name',
        suggestions: [
          {
            text: 'B. A. Baracus',
            value: 'B. A. Baracus',
            hint: 'Drink milk fool'
          },
          {
            text: 'Arnold Schwarzenegger',
            value: 'Arnold Schwarzenegger',
            hint: 'Run get to the chopper'
          }
        ]
      })
    })

    describe('With publish event', () => {
      test('Should reset autocomplete', () => {
        enterValue(autocompleteInput, 'Run get to the chopper')

        // select first suggestion
        suggestionsContainer.children[0].click()

        expect(autocompleteInput.value).toBe('Arnold Schwarzenegger')

        publish(mockPublisher)

        expect(autocompleteInput.value).toBe('')
      })
    })
  })

  describe('When suggestion styles class provided', () => {
    beforeEach(() => {
      setupAdvancedAutoComplete({
        label: {
          text: 'By'
        },
        hint: {
          text: 'Choose a user'
        },
        id: 'user',
        name: 'user',
        template: 'advanced',
        suggestionClasses: 'app-autocomplete__suggestion--leading-hint',
        noSuggestionsMessage: 'choose Image name',
        suggestions: [
          {
            text: 'B. A. Baracus',
            value: 'B. A. Baracus',
            hint: 'Drink milk fool'
          },
          {
            text: 'Arnold Schwarzenegger',
            value: 'Arnold Schwarzenegger',
            hint: 'Run get to the chopper'
          }
        ]
      })
    })

    describe('Suggestion should have expected class extra attribute', () => {
      beforeEach(() => {
        enterValue(autocompleteInput, 'Baracus')
      })

      test('Extra class attribute should be as expected', () => {
        expect(suggestionsContainer.children).toHaveLength(1)
        expect(suggestionsContainer.children[0]).toHaveTextContent(
          /Drink milk fool/
        )
        expect(suggestionsContainer.children[0]).toHaveAttribute(
          'class',
          'app-autocomplete__suggestion app-autocomplete__suggestion--leading-hint'
        )
      })
    })
  })
})
