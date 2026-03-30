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

    const $context = $div.cloneNode(true)
    $context.classList.add('app-suggestion__context')

    const $li = document.createElement('li')

    $li.classList.add('app-autocomplete__suggestion')
    $li.dataset.isMatch = 'false'
    $li.setAttribute('role', 'option')
    $li.setAttribute('tabindex', '-1')

    $li.appendChild($itemValue)
    $li.appendChild($context)

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

    return ($suggestion) =>
      $suggestion?.dataset?.text.toLowerCase().includes(token.toLowerCase())
  }

  populateSuggestion($li, item) {
    $li.dataset.value = item.value
    $li.dataset.text = item.text

    $li.firstElementChild.textContent = item.value
    $li.firstElementChild.nextElementSibling.textContent = item.value

    return $li
  }

  provideSuggestions({ textValue, suggestionIndex } = {}) {
    const textValueTrimmed = textValue?.trim()

    if (textValueTrimmed) {
      // Partial match
      const filterPartialMatch = this.filterPartialMatch(textValueTrimmed)

      return this.getSuggestionsMarkup()
        .filter(filterPartialMatch)
        .map(
          this.dressSuggestion({ textValue: textValueTrimmed, suggestionIndex })
        )
    } else {
      // Reset suggestions
      return this.getSuggestionsMarkup().map(
        this.dressSuggestion({ textValue: textValueTrimmed, suggestionIndex })
      )
    }
  }
}

export { AutocompleteSearch }
