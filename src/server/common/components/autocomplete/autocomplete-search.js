import { history } from '../../../../client/common/helpers/history.js'
import { Autocomplete } from './autocomplete.js'

/**
 * @classdesc AutoComplete Search component
 * @class
 * @augments Autocomplete
 */
class AutocompleteSearch extends Autocomplete {
  constructor($module) {
    super($module, { includeInput: true })
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

  choiceAction() {
    this.submitForm()
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
    return ($suggestion) =>
      $suggestion?.dataset?.text
        .toLowerCase()
        .includes(textValue.replace(/[*^:~+-]/g, '').toLowerCase()) // Remove lunr special characters
  }

  populateSuggestion($li, item) {
    $li.dataset.value = item.value
    $li.dataset.text = item.text

    $li.firstElementChild.textContent = item.value
    $li.firstElementChild.nextElementSibling.textContent = item.value

    return $li
  }

  provideSuggestions({ textValue, suggestionIndex } = {}) {
    if (textValue) {
      // Partial match
      const filterPartialMatch = this.filterPartialMatch(textValue)

      return this.getSuggestionsMarkup()
        .filter(filterPartialMatch)
        .map(this.dressSuggestion({ textValue, suggestionIndex }))
    } else {
      // Reset suggestions
      return this.getSuggestionsMarkup().map(
        this.dressSuggestion({ textValue, suggestionIndex })
      )
    }
  }
}

export { AutocompleteSearch }
