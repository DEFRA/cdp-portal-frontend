import { AutocompleteSearch } from './autocomplete-search.js'

/**
 * @classdesc AutoComplete Doc Search component.
 * Extends AutocompleteSearch with documentation-specific behaviour:
 * group headers per .md file, anchor-aware hidden input, and hint-slot
 * populated from item.hint (the matched snippet) rather than item.value.
 * @class
 * @augments AutocompleteSearch
 */
class AutocompleteDocSearch extends AutocompleteSearch {
  createSuggestionElementTemplate() {
    const $span = document.createElement('span')
    const $div = document.createElement('div')

    const $itemValue = $span.cloneNode(true)
    $itemValue.classList.add('app-suggestion__value')

    const $hint = $div.cloneNode(true)
    $hint.classList.add('app-suggestion__hint')

    const $li = document.createElement('li')

    $li.classList.add('app-autocomplete__suggestion')
    $li.dataset.isMatch = 'false'
    $li.setAttribute('role', 'option')
    $li.setAttribute('tabindex', '-1')

    $li.appendChild($itemValue)
    $li.appendChild($hint)

    return $li
  }

  populateSuggestion($li, item) {
    $li.dataset.value = item.value
    $li.dataset.text = item.text

    if (item.hint) {
      $li.dataset.hint = item.hint
    }

    if (item.anchor) {
      $li.dataset.anchor = item.anchor
    }

    const $value = $li.firstElementChild
    const $hint = $value.nextElementSibling

    $value.textContent = item.value
    $hint.textContent = item.hint ?? ''

    $li.classList.toggle(
      'app-autocomplete__suggestion--heading-match',
      !item.hint
    )
    $li.classList.toggle(
      'app-autocomplete__suggestion--body-match',
      !!item.hint
    )

    return $li
  }

  /**
   * Disabled: the visible input shows the typed query, not the suggestion text,
   * so exact-text lookup would spuriously match heading titles and overwrite
   * the navigation value already set by updateInputValue.
   */
  getSuggestionByText() {
    return undefined
  }

  filterPartialMatch(textValue) {
    const token = this.disableLunrSpecialCharactersFilter
      ? textValue
      : textValue.replace(/[*^:~+-]/g, '')

    const tokenLower = token.toLowerCase()

    return ($suggestion) =>
      $suggestion?.dataset?.text.toLowerCase().includes(tokenLower) ||
      $suggestion?.dataset?.hint?.toLowerCase().includes(tokenLower)
  }

  /**
   * Overrides base to handle doc (.md) results:
   * - appends the heading anchor to the hidden value (e.g. file.md#section)
   * - keeps the visible input showing what the user typed, not the snippet
   * choiceAction triggers a second call via dispatchInputEvent; anchor preservation
   * guards against that second call overwriting the anchor already set by the first.
   */
  updateInputValue({ text, value, withPublish = true } = {}) {
    if (!value?.endsWith('.md')) {
      return super.updateInputValue({ text, value, withPublish })
    }

    const hidden = this.$autocompleteHiddenInput?.value ?? ''
    const hashIndex = hidden.indexOf('#')
    if (hashIndex !== -1 && hidden.slice(0, hashIndex) === value) {
      return super.updateInputValue({
        text: this.$autocomplete.value,
        value: hidden,
        withPublish
      })
    }

    const suggestions =
      this.$suggestionsContainer?.querySelectorAll(
        '.app-autocomplete__suggestion'
      ) ?? []
    const anchor = Array.from(suggestions).find(
      ($s) => $s.dataset.text === text && $s.dataset.value === value
    )?.dataset?.anchor

    return super.updateInputValue({
      text: this.$autocomplete.value,
      value: anchor ? `${value}#${anchor}` : value,
      withPublish
    })
  }

  createGroupHeader(filePath) {
    const $li = document.createElement('li')
    $li.classList.add('app-autocomplete__suggestion-group')
    $li.textContent = filePath
    $li.setAttribute('aria-hidden', 'true')
    return $li
  }

  injectGroupHeaders($rendered) {
    this.$suggestionsContainer.replaceChildren()
    let lastValue = null
    for (const $s of $rendered) {
      const value = $s.dataset?.value
      if (value?.endsWith('.md') && value !== lastValue) {
        this.$suggestionsContainer.appendChild(this.createGroupHeader(value))
        lastValue = value
      }
      this.$suggestionsContainer.appendChild($s)
    }
  }

  populateSuggestions({ textValue, suggestionIndex } = {}) {
    const $suggestions = super.populateSuggestions({
      textValue,
      suggestionIndex
    })

    // Inject a group header <li> before each new .md file group in the DOM.
    // Not returned so they are invisible to arrow-key / enter navigation.
    this.injectGroupHeaders(Array.from(this.$suggestionsContainer.children))

    return $suggestions
  }
}

export { AutocompleteDocSearch }
