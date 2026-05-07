import { history } from '../../../../client/common/helpers/history.js'
import { Autocomplete } from './autocomplete.js'

/**
 * @classdesc AutoComplete Search component
 * @class
 * @augments Autocomplete
 */
class AutocompleteSearch extends Autocomplete {
  constructor($module) {
    const disableLunrSpecialCharactersFilter = $module.querySelector(
      `[data-js*="app-progressive-input"]`
    ).dataset.disableLunrSpecialCharactersFilter
    const disableAutoSubmit = $module.querySelector(
      `[data-js*="app-progressive-input"]`
    ).dataset.disableAutoSubmit

    super($module, { includeInput: true })

    this.disableLunrSpecialCharactersFilter = disableLunrSpecialCharactersFilter
    this.disableAutoSubmit = disableAutoSubmit
  }

  choiceAction() {
    super.choiceAction()

    if (!this.disableAutoSubmit) {
      this.submitForm()
    }
  }

  autocompleteInputEvent(event) {
    if (this.isSuggestionsHidden) {
      this.openSuggestions()
    }

    const textValue = event?.target?.value

    if (textValue) {
      this.showCloseButton()
    } else {
      this.hideCloseButton()
      this.$suggestionsContainer.scrollTop = 0 // Move suggestions window scroll bar to top
      this.suggestionIndex = null // Typing in input, no current highlight of suggestion, reset selection index
    }

    if (this.dataFetcher.isEnabled) {
      this.callDataFetcher(textValue)
    }

    this.populateSuggestions({
      textValue,
      suggestionIndex: this.suggestionIndex
    })

    const foundSuggestion = this.getSuggestionByText(textValue)

    // An exact match was found
    if (foundSuggestion?.value) {
      this.updateInputValue({
        text: textValue,
        value: foundSuggestion.value
      })
      return
    }

    if (!textValue) {
      this.updateInputValue({ text: textValue, value: textValue })
    }
  }

  clearButtonClickEvent() {
    super.clearButtonClickEvent()

    const currentUrl = new URL(location)
    currentUrl.search = ''
    currentUrl.hash = ''
    history.replace(currentUrl.toString())
  }

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

  dressSuggestion({ textValue, suggestionIndex } = {}) {
    return ($suggestion, index) => {
      this.manageTextHighlight($suggestion, textValue)
      this.manageChoiceHighlight($suggestion, index, suggestionIndex)

      return $suggestion
    }
  }

  filterPartialMatch(textValue) {
    // Remove lunr special characters
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

  provideSuggestions({ textValue, suggestionIndex } = {}) {
    const textValueTrimmed = textValue?.trim()
    const filterFn = textValueTrimmed
      ? this.filterPartialMatch(textValueTrimmed)
      : null

    return this.getSuggestionsMarkup()
      .filter(($s) => !filterFn || filterFn($s))
      .map(
        this.dressSuggestion({ textValue: textValueTrimmed, suggestionIndex })
      )
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

export { AutocompleteSearch }
