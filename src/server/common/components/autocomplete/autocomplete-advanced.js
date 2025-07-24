import escape from 'lodash/escape.js'

import { Autocomplete } from './autocomplete.js'

/**
 * @classdesc Advanced Autocomplete component, supports suggestion hints/extra metadata.
 * @class
 * @augments Autocomplete
 */
class AutocompleteAdvanced extends Autocomplete {
  createSuggestionElementTemplate() {
    const $span = document.createElement('span')

    const $itemValue = $span.cloneNode(true)
    $itemValue.classList.add('app-suggestion__value')

    const $hintContent = $span.cloneNode(true)
    $hintContent.classList.add('app-suggestion__hint')

    const $action = $span.cloneNode(true)
    $action.classList.add('app-suggestion__action')

    const $li = document.createElement('li')

    $li.classList.add('app-autocomplete__suggestion')

    if (this.suggestionClasses) {
      const suggestionClasses = this.suggestionClasses?.split(' ') ?? []
      $li.classList.add(...suggestionClasses)
    }

    $li.dataset.isMatch = 'false'
    $li.setAttribute('role', 'option')
    $li.setAttribute('tabindex', '-1')

    $li.appendChild($itemValue)
    $li.appendChild($hintContent)
    $li.appendChild($action)

    return $li
  }

  filterPartialMatch(textValue) {
    return ($suggestion) =>
      $suggestion?.dataset?.text
        .toLowerCase()
        .includes(textValue.toLowerCase()) ||
      $suggestion?.dataset?.hint.toLowerCase().includes(textValue.toLowerCase())
  }

  filterExactMatch(textValue) {
    return ($suggestion) =>
      $suggestion?.dataset?.text.toLowerCase() === textValue.toLowerCase() ||
      $suggestion?.dataset?.hint.toLowerCase() === textValue.toLowerCase()
  }

  /**
   * @param {HTMLLIElement} $li
   * @param {Suggestion} item
   * @returns {HTMLLIElement}
   */
  populateSuggestion($li, item) {
    $li.dataset.value = item.value
    $li.dataset.text = item.text

    $li.firstElementChild.textContent = item.value

    $li.dataset.hint = item.hint
    $li.firstElementChild.nextElementSibling.textContent = item.hint

    return $li
  }

  highlightHint(hint, textValue) {
    const fragment = document.createElement('div')
    fragment.innerHTML = hint

    Array.from(fragment.children).forEach((child) => {
      child.innerHTML = child.innerHTML.replace(
        new RegExp(escape(textValue), 'gi'),
        `<strong>$&</strong>`
      )
    })

    return fragment.outerHTML
  }

  manageTextHighlight($suggestion, textValue = null) {
    if (textValue) {
      $suggestion.firstElementChild.innerHTML =
        $suggestion.dataset?.text.replace(
          new RegExp(escape(textValue), 'gi'),
          `<strong>$&</strong>`
        )

      $suggestion.firstElementChild.nextElementSibling.innerHTML =
        this.highlightHint($suggestion.dataset?.hint, textValue)
    } else {
      $suggestion.firstElementChild.innerHTML = $suggestion.dataset?.text
      $suggestion.firstElementChild.nextElementSibling.innerHTML =
        $suggestion.dataset?.hint
    }

    return $suggestion
  }
}

export { AutocompleteAdvanced }
