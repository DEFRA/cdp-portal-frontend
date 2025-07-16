import { renderTestComponent } from '~/test-helpers/component-helpers.js'
import { dispatchDomContentLoaded } from '~/test-helpers/dispatch-dom-content-loaded.js'
import { enterValue, pressEnter } from '~/test-helpers/keyboard.js'
import { flushAsync } from '~/test-helpers/flush-async.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { AutocompleteSearch } from '~/src/server/common/components/autocomplete/autocomplete-search.js'

const emptySuggestions = buildOptions([])
const searchSuggestions = buildOptions([
  {
    value: 'how-to/sqs-sns.md',
    text: 'SQS queue details:'
  },
  {
    value: 'how-to/sqs-sns.md',
    text: 'about SQS DLQ queues'
  },
  {
    value: 'how-to/sqs-sns.md',
    text: 'provides SQS queues and SNS topics for services running'
  },
  {
    value: 'how-to/sqs-sns.md',
    text: 'SQS FIFO type is set then SNS topic will be'
  }
])

function setupAutoComplete({ searchParam, params = {} }) {
  if (searchParam) {
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        search: `?q=${searchParam}`
      }
    })
  }

  return renderTestComponent('autocomplete', params)
}

const mockFormSubmit = jest.fn().mockReturnValue(false)

/**
 * Set up mock form
 */
function setupForm($components) {
  document.body.innerHTML = `<form id="mock-search-form"></form>`

  // Add components suggestions into the components <script/> tag
  $components.forEach(($component) => {
    const scriptElement = document.createElement('script')
    scriptElement.innerHTML = $component(
      '[data-testid="app-autocomplete-suggestions"]'
    )
      .first()
      .html()
    document.getElementsByTagName('html')[0].appendChild(scriptElement)

    const form = document.getElementById('mock-search-form')
    form.submit = mockFormSubmit

    form.innerHTML += $component('[data-testid="app-autocomplete-group"]')
      .first()
      .html()
  })

  // Init ClientSide JavaScript
  const autocompletes = Array.from(
    document.querySelectorAll('[data-js="app-autocomplete-search"]')
  )

  if (autocompletes.length) {
    autocompletes.forEach(
      ($autocomplete) => new AutocompleteSearch($autocomplete)
    )
  }

  return autocompletes
}

function setupSingleAutoComplete({ searchParam, params = {} } = {}) {
  const elements = setup([
    setupAutoComplete({
      params: {
        label: { text: 'Search' },
        hint: { text: 'Type to search' },
        id: 'search',
        name: 'q',
        template: 'search',
        suggestions: emptySuggestions,
        suggestionsContainer: {
          classes: 'app-autocomplete__suggestions--large'
        },
        placeholder: 'Search docs',
        dataFetcher: {
          isEnabled: true,
          name: 'fetchSuggestions',
          loader: 'search-docs-loader'
        },
        noSuggestionsMessage: 'no results',
        loader: {
          name: 'search-docs-loader'
        },
        ...params
      },
      searchParam
    })
  ])

  if (searchParam) {
    dispatchDomContentLoaded()
  }

  const firstElement = elements.at(0)

  return {
    autocompleteInput: firstElement.autocompleteInput,
    autocompleteHiddenInput: firstElement.autocompleteHiddenInput,
    chevronButton: firstElement.chevronButton,
    suggestionsContainer: firstElement.suggestionsContainer
  }
}

/**
 * Setup Mock form and autocomplete functions. Provide autocomplete elements back for testing purposes
 */
function setup(components) {
  const autoCompletes = setupForm(components)

  return autoCompletes.map((autoComplete) => ({
    autocompleteInput: autoComplete.querySelector(
      '[data-testid="app-autocomplete-input"]'
    ),
    autocompleteHiddenInput: autoComplete.querySelector(`input[type="hidden"]`),
    chevronButton: autoComplete.querySelector(
      '[data-testid="app-chevron-button"]'
    ),
    suggestionsContainer: autoComplete.querySelector(
      '[data-testid="app-autocomplete-suggestions"]'
    )
  }))
}

describe('#autocompleteSearch', () => {
  const mockFetchSuggestions = jest.fn()

  beforeEach(() => {
    window.cdp = window.cdp || {}
    window.cdp.fetchSuggestions = mockFetchSuggestions
  })

  describe('Without query param', () => {
    let autocompleteInput
    let autocompleteHiddenInput
    let chevronButton
    let suggestionsContainer

    beforeEach(() => {
      ;({
        autocompleteInput,
        autocompleteHiddenInput,
        chevronButton,
        suggestionsContainer
      } = setupSingleAutoComplete())
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
          'app-autocomplete-search-suggestions'
        )
      })

      test('Chevron button should have control of suggestions', () => {
        expect(chevronButton).toHaveAttribute(
          'aria-owns',
          'app-autocomplete-search-suggestions'
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

      test('Should contain expected suggestions when input clicked', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(1)
        expect(children[0]).toHaveTextContent(` - - no results - - `.trim())
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

        expect(children).toHaveLength(1)
        expect(children[0]).toHaveTextContent(` - - no results - - `.trim())
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
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)
        await flushAsync()
      })

      describe('Entered into input', () => {
        beforeEach(() => {
          enterValue(autocompleteInput, 'SQS')
        })

        test('Should open suggestions', () => {
          expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
          expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
        })

        test('Should narrow to only expected suggestion', () => {
          expect(suggestionsContainer.children).toHaveLength(4)
          expect(suggestionsContainer.children[0]).toHaveTextContent(
            'SQS queue details:how-to/sqs-sns.md'
          )
          expect(suggestionsContainer.children[1]).toHaveTextContent(
            'about SQS DLQ queueshow-to/sqs-sns.md'
          )
          expect(suggestionsContainer.children[2]).toHaveTextContent(
            'provides SQS queues and SNS topics for services runninghow-to/sqs-sns.md'
          )
          expect(suggestionsContainer.children[3]).toHaveTextContent(
            'SQS FIFO type is set then SNS topic will behow-to/sqs-sns.md'
          )
        })

        test('Should not have set hidden input value', () => {
          expect(autocompleteHiddenInput.value).toBe('')
        })
      })

      describe('That matches multiple suggestions is entered into input', () => {
        beforeEach(() => {
          enterValue(autocompleteInput, 'provides')
        })

        test('Should open suggestions', () => {
          expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
          expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
        })

        test('Should narrow to only expected suggestions', () => {
          expect(suggestionsContainer.children).toHaveLength(1)
          expect(suggestionsContainer.children[0]).toHaveTextContent(
            'provides SQS queues and SNS topics for services runninghow-to/sqs-sns.md'
          )
        })
      })

      describe('With crazy case value entered into input', () => {
        beforeEach(() => {
          enterValue(autocompleteInput, 'serVices')
        })

        test('Should narrow to only expected case insensitive suggestion', () => {
          expect(suggestionsContainer.children).toHaveLength(1)
          expect(suggestionsContainer.children[0].textContent.trim()).toBe(
            'provides SQS queues and SNS topics for services runninghow-to/sqs-sns.md'
          )
        })
      })
    })

    describe('With exact match entered into input', () => {
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)
        await flushAsync()
        enterValue(
          autocompleteInput,
          'SQS FIFO type is set then SNS topic will be'
        )
      })

      test('Should only show matched suggestion', () => {
        expect(suggestionsContainer.children).toHaveLength(1)
      })

      test('Should not have set hidden input value', () => {
        expect(autocompleteHiddenInput.value).toBe('')
      })

      test('When chosen, should set hidden input value', () => {
        expect(autocompleteHiddenInput.value).toBe('')

        const arrowDownKeyEvent = new KeyboardEvent('keydown', {
          code: 'arrowdown'
        })
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)
        pressEnter(autocompleteInput)

        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
          'app-autocomplete-q-suggestion-1'
        )
        expect(autocompleteHiddenInput.value).toBe('how-to/sqs-sns.md')
        expect(mockFormSubmit).toHaveBeenCalled()
      })
    })

    describe('When value removed from input', () => {
      beforeEach(async () => {
        mockFetchSuggestions
          .mockResolvedValueOnce(searchSuggestions)
          .mockResolvedValueOnce(emptySuggestions)
        await flushAsync()
        enterValue(autocompleteInput, 'running')
        enterValue(autocompleteInput, '')
      })

      test('Suggestions should be open', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
      })

      test('Should contain expected suggestions', () => {
        const children = suggestionsContainer.children

        expect(children).toHaveLength(1)

        expect(children[0]).toHaveTextContent(` - - select - - `.trim())
      })
    })

    describe('When value without results entered into input', () => {
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)
        await flushAsync()
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

    describe('When "backspace" pressed in empty input', () => {
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)
        await flushAsync()
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
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)
        await flushAsync()
        enterValue(autocompleteInput, 'SQS')
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
          'app-autocomplete-q-suggestion-1'
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
          'app-autocomplete-q-suggestion-2'
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
          'app-autocomplete-q-suggestion-1'
        )
      })
    })

    describe('When keyboard "enter" key pressed in suggestions', () => {
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)
        await flushAsync()
        enterValue(autocompleteInput, 'SQS')

        const arrowDownKeyEvent = new KeyboardEvent('keydown', {
          code: 'arrowdown'
        })
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)
        autocompleteInput.dispatchEvent(arrowDownKeyEvent)
      })

      test('Should provide expected suggestion value', () => {
        expect(autocompleteInput.value).toBe('SQS')
      })

      test('Input should keep focus', () => {
        expect(autocompleteInput).toHaveFocus()
      })

      test('Suggestions should be open', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'true')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'true')
      })

      test('Should have correct aria activedescendant value', () => {
        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
          'app-autocomplete-q-suggestion-1'
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

        expect(children[0]).toHaveAttribute('aria-setsize', '6')
      })

      test('highlighted suggestion Should have expected data attributes', () => {
        const children = suggestionsContainer.children

        const firstChild = children[0]
        expect(firstChild.dataset.value).toBe('how-to/sqs-sns.md')
        expect(firstChild.dataset.text).toBe('SQS queue details:')
        expect(firstChild.dataset.hasHighlight).toBe('true')
      })

      test('Should have expected hidden input value', () => {
        pressEnter(autocompleteInput)

        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
          'app-autocomplete-q-suggestion-1'
        )
        expect(autocompleteHiddenInput.value).toBe('how-to/sqs-sns.md')
        expect(mockFormSubmit).toHaveBeenCalled()
      })
    })

    describe('When suggestion is clicked', () => {
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)
        enterValue(autocompleteInput, 'SQS')

        await flushAsync()

        autocompleteInput.focus()
        suggestionsContainer.children[2].click()
      })

      test('Should provide expected suggestion value', () => {
        expect(autocompleteInput.value).toBe(
          'provides SQS queues and SNS topics for services running'
        )
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
          'app-autocomplete-q-suggestion-4'
        )
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children
        expect(children[0]).toHaveAttribute('aria-posinset', '4')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children
        expect(children[0]).toHaveAttribute('aria-selected', 'false')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-setsize', '6')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.isMatch).toBe('false')
        expect(firstChild.dataset.value).toBe('how-to/sqs-sns.md')
        expect(firstChild.dataset.text).toBe(
          'provides SQS queues and SNS topics for services running'
        )
        expect(firstChild.dataset.hasHighlight).toBe('false')
      })
    })

    describe('When keyboard "enter" key is pressed with input value', () => {
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)

        await flushAsync()

        enterValue(autocompleteInput, 'SQS')
        pressEnter(autocompleteInput)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
      })
    })

    describe('When keyboard "enter" key is pressed with matching input value', () => {
      beforeEach(async () => {
        mockFetchSuggestions.mockResolvedValue(searchSuggestions)

        await flushAsync()

        enterValue(autocompleteInput, 'about SQS DLQ queues')
        pressEnter(autocompleteInput)
      })

      test('Suggestions should be closed', () => {
        expect(suggestionsContainer).toHaveAttribute('aria-expanded', 'false')
        expect(autocompleteInput).toHaveAttribute('aria-expanded', 'false')
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children
        expect(children[0]).toHaveAttribute('aria-posinset', '3')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-setsize', '6')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.value).toBe('how-to/sqs-sns.md')
        expect(firstChild.dataset.text).toBe('about SQS DLQ queues')
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

  describe('With query param', () => {
    let autocompleteInput
    let suggestionsContainer

    beforeEach(async () => {
      mockFetchSuggestions.mockResolvedValue(searchSuggestions)
      await flushAsync()
      ;({ autocompleteInput, suggestionsContainer } = setupSingleAutoComplete({
        searchParam: 'SQS queue details:',
        params: { suggestions: emptySuggestions }
      }))

      autocompleteInput.focus()
    })

    describe('On load with query param', () => {
      test('Should have correct aria activedescendant value', () => {
        expect(autocompleteInput).toHaveAttribute(
          'aria-activedescendant',
          'app-autocomplete-q-suggestion-2'
        )
      })

      test('suggestions Should have correct aria posinset values', () => {
        const children = suggestionsContainer.children
        expect(children[0]).toHaveAttribute('aria-posinset', '2')
      })

      test('suggestions Should have correct aria selected values', () => {
        const children = suggestionsContainer.children
        expect(children[0]).toHaveAttribute('aria-selected', 'false')
      })

      test('suggestions Should have correct aria setsize values', () => {
        const children = suggestionsContainer.children

        expect(children[0]).toHaveAttribute('aria-setsize', '6')
      })

      test('suggestions Should have expected data attributes', () => {
        const children = suggestionsContainer.children
        const firstChild = children[0]

        expect(firstChild.dataset.value).toBe('how-to/sqs-sns.md')
        expect(firstChild.dataset.text).toBe('SQS queue details:')
        expect(firstChild.dataset.hasHighlight).toBe('false')
      })
    })
  })

  describe('With placeholder', () => {
    const typeHere = ' - - type here - - '
    let autocompleteInput

    beforeEach(() => {
      ;({ autocompleteInput } = setupSingleAutoComplete({
        params: {
          placeholder: typeHere
        }
      }))
    })

    test('Should have expected placeholder', () => {
      expect(autocompleteInput).toHaveAttribute('placeholder', typeHere)
    })
  })

  describe('With data fetcher', () => {
    let autocompleteInput
    let suggestionsContainer

    beforeEach(() => {
      ;({ autocompleteInput, suggestionsContainer } = setupSingleAutoComplete({
        suggestions: emptySuggestions
      }))
    })

    test('When input clicked, Should contain expected suggestions', () => {
      autocompleteInput.click()
      const children = suggestionsContainer.children

      expect(children).toHaveLength(1)
      expect(children[0]).toHaveTextContent(` - - no results - - `.trim())
    })

    test('When text entered into autocomplete, Should fetch data', async () => {
      mockFetchSuggestions.mockResolvedValue([
        { text: 'run, get to the chopper', value: 'predator' }
      ])

      const fetchTerm = 'run, get to the chopper'
      enterValue(autocompleteInput, fetchTerm)

      await flushAsync()

      expect(mockFetchSuggestions).toHaveBeenCalledWith(fetchTerm)

      const children = suggestionsContainer.children

      expect(children).toHaveLength(1)
      expect(children[0]).toHaveTextContent(/run, get to the chopper/)
    })
  })
})
