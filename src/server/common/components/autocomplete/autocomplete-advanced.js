import { Autocomplete } from '~/src/server/common/components/autocomplete/autocomplete'

/**
 * @classdesc Advanced Autocomplete component, supports hints.
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
    $li.dataset.isMatch = 'false'
    $li.setAttribute('role', 'option')
    $li.setAttribute('tabindex', '-1')

    $li.appendChild($itemValue)
    $li.appendChild($hintContent)
    $li.appendChild($action)

    return $li
  }

  getPartialMatch(textValue) {
    return ($suggestion) =>
      $suggestion?.dataset?.text
        .toLowerCase()
        .includes(textValue.toLowerCase()) ||
      $suggestion?.dataset?.hint.toLowerCase().includes(textValue.toLowerCase())
  }

  populateSuggestion($li, item) {
    $li.dataset.value = item.value
    $li.dataset.text = item.text

    $li.firstElementChild.textContent = item.value

    $li.dataset.hint = item.hint
    $li.firstElementChild.nextElementSibling.textContent = item.hint

    return $li
  }

  manageTextHighlight($suggestion, textValue = null) {
    if (textValue) {
      $suggestion.firstElementChild.innerHTML =
        $suggestion.dataset?.text.replace(
          new RegExp(textValue, 'gi'),
          `<strong>$&</strong>`
        )

      $suggestion.firstElementChild.nextElementSibling.innerHTML =
        $suggestion.dataset?.hint.replace(
          new RegExp(textValue, 'gi'),
          `<strong>$&</strong>`
        )
    } else {
      $suggestion.firstElementChild.innerHTML = $suggestion.dataset?.text
      $suggestion.firstElementChild.nextElementSibling.innerHTML =
        $suggestion.dataset?.hint
    }

    return $suggestion
  }
}

export { AutocompleteAdvanced }
