import { renderTestComponent } from '../../../../../test-helpers/component-helpers.js'
import { enterValue, pressEnter } from '../../../../../test-helpers/keyboard.js'
import { flushAsync } from '../../../../../test-helpers/flush-async.js'
import { buildOptions } from '../../helpers/options/build-options.js'
import { AutocompleteDocSearch } from './autocomplete-doc-search.js'
import { injectAndRunScript } from '../../../../../test-helpers/inject-and-run-script.js'

const mockFormSubmit = vi.fn().mockReturnValue(false)

function setupDocSearch() {
  const $component = renderTestComponent('autocomplete', {
    params: {
      label: { text: 'Search' },
      id: 'doc-search',
      name: 'q',
      template: 'doc-search',
      suggestions: buildOptions([]),
      suggestionsContainer: { classes: 'app-autocomplete__suggestions--large' },
      placeholder: 'Search docs',
      dataFetcher: {
        isEnabled: true,
        name: 'fetchSuggestions',
        loader: 'search-docs-loader'
      },
      noSuggestionsMessage: 'no results',
      loader: { name: 'search-docs-loader' }
    }
  })

  document.body.innerHTML = `<form id="mock-search-form"></form>`

  const js = $component('[data-testid="app-autocomplete-suggestions"]')
    .first()
    .text()
  injectAndRunScript(js)

  const form = document.getElementById('mock-search-form')
  form.submit = mockFormSubmit
  form.innerHTML += $component('[data-testid="app-autocomplete-group"]')
    .first()
    .html()

  const $el = document.querySelector('[data-js="app-autocomplete-doc-search"]')
  ;[$el].forEach(($autocomplete) => new AutocompleteDocSearch($autocomplete))

  return {
    autocompleteInput: $el.querySelector(
      '[data-testid="app-autocomplete-input"]'
    ),
    autocompleteHiddenInput: $el.querySelector('input[type="hidden"]'),
    suggestionsContainer: $el.querySelector(
      '[data-testid="app-autocomplete-suggestions"]'
    )
  }
}

describe('#autocompleteDocSearch', () => {
  const mockFetchSuggestions = vi.fn()

  beforeEach(() => {
    window.cdp = window.cdp || {}
    window.cdp.fetchSuggestions = mockFetchSuggestions
  })

  describe('Group headers', () => {
    let autocompleteInput
    let suggestionsContainer

    beforeEach(async () => {
      ;({ autocompleteInput, suggestionsContainer } = setupDocSearch())

      mockFetchSuggestions.mockResolvedValue([
        { value: 'how-to/proxy.md', text: 'Proxy' },
        { value: 'how-to/proxy.md', text: 'proxy snippet' },
        { value: 'how-to/logging.md', text: 'Logging' }
      ])
      await flushAsync()

      enterValue(autocompleteInput, 'proxy')
      await flushAsync()
    })

    test('Injects a group header before each new .md file group', () => {
      const children = Array.from(suggestionsContainer.children)
      const groupHeaders = children.filter((c) =>
        c.classList.contains('app-autocomplete__suggestion-group')
      )
      expect(groupHeaders).toHaveLength(1)
      expect(groupHeaders[0]).toHaveTextContent('how-to/proxy.md')
    })

    test('Group header appears before its suggestions', () => {
      const children = Array.from(suggestionsContainer.children)
      expect(
        children[0].classList.contains('app-autocomplete__suggestion-group')
      ).toBe(true)
      expect(
        children[1].classList.contains('app-autocomplete__suggestion')
      ).toBe(true)
    })

    test('Group header has aria-hidden', () => {
      const header = suggestionsContainer.querySelector(
        '.app-autocomplete__suggestion-group'
      )
      expect(header).toHaveAttribute('aria-hidden', 'true')
    })

    test('Does not inject group headers for non-.md suggestion values', async () => {
      mockFetchSuggestions.mockResolvedValue([
        { value: 'npm:lodash', text: 'lodash' },
        { value: 'npm:express', text: 'express' }
      ])
      await flushAsync()

      enterValue(autocompleteInput, 'lo')
      await flushAsync()

      const children = Array.from(suggestionsContainer.children)
      expect(
        children.every(
          (c) => !c.classList.contains('app-autocomplete__suggestion-group')
        )
      ).toBe(true)
    })
  })

  describe('Suggestion classes', () => {
    let suggestionsContainer

    beforeEach(async () => {
      ;({ suggestionsContainer } = setupDocSearch())

      mockFetchSuggestions.mockResolvedValue([
        { value: 'guide.md', text: 'Guide heading' },
        {
          value: 'guide.md',
          text: 'A snippet from the guide',
          hint: 'Guide intro section'
        }
      ])
      await flushAsync()

      const input = document.querySelector(
        '[data-testid="app-autocomplete-input"]'
      )
      enterValue(input, 'guide')
      await flushAsync()
    })

    test('Suggestion without hint gets --heading-match class', () => {
      const headingMatch = suggestionsContainer.querySelector(
        '.app-autocomplete__suggestion--heading-match'
      )
      expect(headingMatch).not.toBeNull()
      expect(headingMatch.dataset.text).toBe('Guide heading')
    })

    test('Suggestion with hint gets --body-match class', () => {
      const bodyMatch = suggestionsContainer.querySelector(
        '.app-autocomplete__suggestion--body-match'
      )
      expect(bodyMatch).not.toBeNull()
      expect(bodyMatch.dataset.text).toBe('A snippet from the guide')
    })

    test('Suggestion with hint stores hint in dataset', () => {
      const bodyMatch = suggestionsContainer.querySelector(
        '.app-autocomplete__suggestion--body-match'
      )
      expect(bodyMatch.dataset.hint).toBe('Guide intro section')
    })
  })

  describe('Anchor handling', () => {
    let autocompleteInput
    let autocompleteHiddenInput
    let suggestionsContainer

    beforeEach(async () => {
      ;({ autocompleteInput, autocompleteHiddenInput, suggestionsContainer } =
        setupDocSearch())

      mockFetchSuggestions.mockResolvedValue([
        { value: 'how-to/proxy.md', text: 'Proxy', anchor: 'proxy' },
        {
          value: 'how-to/proxy.md',
          text: 'proxy snippet',
          hint: 'Overview',
          anchor: 'overview'
        }
      ])
      await flushAsync()

      enterValue(autocompleteInput, 'proxy')
      await flushAsync()
    })

    test('Anchor is stored in suggestion dataset', () => {
      const headingMatch = suggestionsContainer.querySelector(
        '.app-autocomplete__suggestion--heading-match'
      )
      expect(headingMatch.dataset.anchor).toBe('proxy')
    })

    test('Selecting a heading match sets hidden input to file.md#anchor', () => {
      const arrowDown = new KeyboardEvent('keydown', { code: 'arrowdown' })
      autocompleteInput.dispatchEvent(arrowDown)
      pressEnter(autocompleteInput)

      expect(autocompleteHiddenInput.value).toBe('how-to/proxy.md#proxy')
    })

    test('Visible input keeps the typed text, not the file path', () => {
      const arrowDown = new KeyboardEvent('keydown', { code: 'arrowdown' })
      autocompleteInput.dispatchEvent(arrowDown)
      pressEnter(autocompleteInput)

      expect(autocompleteInput.value).toBe('proxy')
    })
  })

  describe('Filter by hint text', () => {
    let suggestionsContainer

    beforeEach(async () => {
      ;({ suggestionsContainer } = setupDocSearch())

      mockFetchSuggestions.mockResolvedValue([
        {
          value: 'guide.md',
          text: 'unrelated heading',
          hint: 'proxy configuration details'
        }
      ])
      await flushAsync()
    })

    test('Suggestion matching hint text (not display text) is shown', async () => {
      const input = document.querySelector(
        '[data-testid="app-autocomplete-input"]'
      )
      enterValue(input, 'proxy')
      await flushAsync()

      const suggestions = suggestionsContainer.querySelectorAll(
        '.app-autocomplete__suggestion'
      )
      expect(suggestions).toHaveLength(1)
      expect(suggestions[0].dataset.text).toBe('unrelated heading')
    })

    test('Suggestion not matching hint or text is hidden', async () => {
      const input = document.querySelector(
        '[data-testid="app-autocomplete-input"]'
      )
      enterValue(input, 'something completely different')
      await flushAsync()

      const children = suggestionsContainer.children
      expect(children).toHaveLength(1)
      expect(children[0]).toHaveTextContent('no results')
    })
  })
})
