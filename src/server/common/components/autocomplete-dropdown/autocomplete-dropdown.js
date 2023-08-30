import qs from 'qs'
import { find, isNull } from 'lodash'

import { hasVerticalScrollbar } from '~/src/client/common/helpers/has-vertical-scrollbar'

const tickSvgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" class="app-tick-icon" width="40" height="40" viewBox="0 -960 960 960">
      <path d="M380.103-242.155 152.617-469.641l47.998-47.742 179.488 179.487 380.205-380.462 47.998 47.999-428.203 428.204Z"/>
    </svg>`.trim()

function createSuggestion() {
  const content = document.createElement('span')
  content.classList.add('app-suggestion__content')

  const action = document.createElement('span')
  action.classList.add('app-suggestion__action')

  const li = document.createElement('li')

  li.classList.add('app-autocomplete-dropdown__suggestion')
  li.setAttribute('role', 'option')
  li.setAttribute('tabindex', '-1')
  li.setAttribute('aria-selected', 'false')
  li.dataset.isMatch = 'false'

  li.appendChild(content)
  li.appendChild(action)

  return li
}

function buildSuggestion(item, listElement) {
  const li = listElement.cloneNode(true)

  li.dataset.value = item.value
  li.dataset.text = item.text
  li.firstChild.textContent = item.text

  return li
}

function manageTextHighlight($suggestion, value = null) {
  if (value) {
    $suggestion.firstChild.innerHTML = $suggestion.dataset?.text.replace(
      new RegExp(value, 'gi'),
      `<strong>$&</strong>`
    )
  } else {
    $suggestion.firstChild.innerHTML = $suggestion.dataset?.text
  }

  return $suggestion
}

function manageChoiceHighlight($suggestion, index, suggestionIndex = null) {
  const className = 'app-autocomplete-dropdown__suggestion--highlight'

  if (!isNull(suggestionIndex) && suggestionIndex === index) {
    $suggestion.classList.add(className)
    $suggestion.setAttribute('aria-selected', true)
  } else {
    $suggestion.classList.remove(className)
    $suggestion.setAttribute('aria-selected', false)
  }

  return $suggestion
}

function manageMatch($suggestion, value = null) {
  if (value?.toLowerCase() === $suggestion.dataset?.text?.toLowerCase()) {
    $suggestion.lastChild.innerHTML = tickSvgIcon
    $suggestion.dataset.isMatch = 'true'
  } else {
    $suggestion.lastChild.innerHTML = ''
    $suggestion.dataset.isMatch = 'false'
  }

  return $suggestion
}

function manipulateSuggestion({ value, suggestionIndex } = {}) {
  return ($suggestion, index) => {
    manageTextHighlight($suggestion, value)
    manageChoiceHighlight($suggestion, index, suggestionIndex)
    manageMatch($suggestion, value)

    return $suggestion
  }
}

function buildNoResults() {
  const li = document.createElement('li')

  li.classList.add(
    'app-autocomplete-dropdown__suggestion',
    'app-autocomplete-dropdown__suggestion--no-results'
  )
  li.setAttribute('role', 'option')
  li.textContent = 'No results'

  return li
}

function enhanceSelectWithAutoComplete($module) {
  const $select = $module.querySelector(
    `[data-js="app-autocomplete-dropdown-select"]`
  )
  const $input = document.createElement('input')

  $input.name = $select.name
  $input.id = $select.id
  $input.classList.add('govuk-input', 'app-autocomplete-dropdown__input')

  $input.setAttribute('autocapitalize', 'none')
  $input.setAttribute('autocomplete', 'off')
  $input.setAttribute('role', 'combobox')
  $input.setAttribute('aria-owns', `app-suggestions-${$select.id}`)
  $input.setAttribute('aria-autocomplete', 'list')
  $input.setAttribute('aria-expanded', 'false')
  $input.dataset.js = 'app-autocomplete-dropdown-input'
  $input.dataset.testid = 'app-autocomplete-dropdown-input'
  $input.setAttribute('data-1p-ignore', '') // Disable 1 password widget

  $select.replaceWith($input)
}

function autocompleteDropdown($module) {
  if (!$module) {
    return
  }

  enhanceSelectWithAutoComplete($module)

  const $input = $module.querySelector(
    '[data-js="app-autocomplete-dropdown-input"]'
  )
  const $noJsSubmitButton = $input.form.querySelector(
    '[data-js="app-no-js-submit-button"]'
  )
  const suggestions = window.suggestions?.[$input.name] ?? []
  const queryParams = qs.parse(location?.search, { ignoreQueryPrefix: true })

  const suggestionElement = createSuggestion()
  const $suggestions = suggestions
    .filter((suggestion) => Boolean(suggestion.value))
    .map((suggestion) => buildSuggestion(suggestion, suggestionElement))

  const $clearButton = $module.querySelector(
    '[data-js="app-autocomplete-dropdown-clear-button"]'
  )
  const $chevronButton = $module.querySelector('[data-js="app-chevron-button"]')
  const $suggestionsContainer = $module.querySelector(
    '[data-js="app-autocomplete-dropdown-suggestions"]'
  )

  const isSuggestionsHidden = !$suggestionsContainer.classList.contains(
    'app-autocomplete-dropdown__suggestions--show'
  )

  let suggestionIndex = null
  let suggestionsLength = $suggestions.length

  const isSuggestionsOpen = () =>
    $chevronButton?.getAttribute('aria-expanded') === 'true'

  const dispatchDocumentClickEvent = () =>
    document.dispatchEvent(new Event('click', { bubbles: true }))

  const dispatchSubmitEvent = () =>
    $input.form.dispatchEvent(new Event('submit', { bubbles: true }))

  const dispatchBlurEvent = () =>
    $input.dispatchEvent(new Event('blur', { bubbles: true }))

  const scrollToSelection = () => {
    const $match = $suggestionsContainer.querySelector('[data-is-match="true"]')

    if ($match && hasVerticalScrollbar($suggestionsContainer)) {
      const { height: matchHeight } = $match.getBoundingClientRect()
      const { height: suggestionsHeight } =
        $suggestionsContainer.getBoundingClientRect()
      const matchY = matchHeight + $match.offsetTop

      // Match is out of bounds at the top of the suggestions container
      if ($match.offsetTop < $suggestionsContainer.scrollTop) {
        $suggestionsContainer.scroll(0, $match.offsetTop)
      }

      // Match is out of bounds at the bottom of the suggestions container
      if (matchY > suggestionsHeight) {
        $suggestionsContainer.scroll(0, matchY)
      }
    }
  }

  const openSuggestions = () => {
    suggestionIndex = null
    $suggestionsContainer.scrollTop = 0
    $suggestionsContainer.classList.add(
      'app-autocomplete-dropdown__suggestions--show'
    )
    $suggestionsContainer.setAttribute('aria-live', 'polite')

    $input.setAttribute('aria-expanded', 'true')

    $chevronButton.classList.add(
      'app-autocomplete-dropdown__chevron-button--open'
    )
    $chevronButton.setAttribute('aria-expanded', 'true')

    scrollToSelection()
  }

  const closeSuggestions = () => {
    suggestionIndex = null
    $suggestionsContainer.scrollTop = 0
    $suggestionsContainer.classList.remove(
      'app-autocomplete-dropdown__suggestions--show'
    )
    $suggestionsContainer.setAttribute('aria-live', 'off')

    $input.setAttribute('aria-expanded', 'false')

    $chevronButton.classList.remove(
      'app-autocomplete-dropdown__chevron-button--open'
    )
    $chevronButton.setAttribute('aria-expanded', 'false')
  }

  const showCloseButton = () => {
    $clearButton.classList.add('app-autocomplete-dropdown__clear-button--show')
    $clearButton.setAttribute('aria-hidden', 'false')
  }

  const hideCloseButton = () => {
    $clearButton.classList.remove(
      'app-autocomplete-dropdown__clear-button--show'
    )
    $clearButton.setAttribute('aria-hidden', 'true')
  }

  const hasExactCaseInsensitiveMatch = (value) =>
    find(
      $suggestions,
      (s) => s.dataset.text?.toLowerCase() === value?.toLowerCase()
    )

  const populateSuggestions = ({ value, suggestionIndex } = {}) => {
    let $values

    if (hasExactCaseInsensitiveMatch(value)) {
      $values = $suggestions.map(
        manipulateSuggestion({ value, suggestionIndex })
      )
    } else if (value) {
      // Partial match
      $values = $suggestions
        .filter(($suggestion) =>
          $suggestion.dataset?.text.toLowerCase().includes(value?.toLowerCase())
        )
        .map(manipulateSuggestion({ value, suggestionIndex }))
    } else {
      // Reset
      $values = $suggestions.map(
        manipulateSuggestion({ value, suggestionIndex })
      )
    }

    $values = $values.length ? $values : [buildNoResults()]

    $suggestionsContainer.replaceChildren(...$values)
    suggestionsLength = $values.length

    return $values
  }

  document.addEventListener('DOMContentLoaded', () => {
    $noJsSubmitButton.remove()

    const queryParamValue = queryParams?.[$input.name]

    if (queryParamValue) {
      $input.value = queryParamValue
      showCloseButton()
    }

    populateSuggestions({ value: $input.value, suggestionIndex })
  })

  $clearButton.addEventListener('click', () => {
    $input.value = ''
    $input.focus()

    dispatchSubmitEvent()
    hideCloseButton()
    populateSuggestions({ value: $input.value, suggestionIndex })
  })

  $chevronButton.addEventListener('click', (event) => {
    event.stopPropagation()

    populateSuggestions({ value: $input.value, suggestionIndex })

    if (isSuggestionsOpen()) {
      closeSuggestions()
    } else {
      openSuggestions()
    }
  })

  // Click outside Dropdown component
  document.addEventListener('click', (event) => {
    if (event.target !== $input) {
      closeSuggestions()
      populateSuggestions()
    }
  })

  // User focus into the input
  $input.addEventListener('focus', (event) => {
    const value = event?.target?.value

    populateSuggestions({ value, suggestionIndex })
    openSuggestions()
  })

  // Mouse clicks into the input
  $input.addEventListener('click', (event) => {
    dispatchDocumentClickEvent()

    event.stopPropagation()

    const value = event?.target?.value

    populateSuggestions({ value, suggestionIndex })
    openSuggestions()
  })

  // User typing inside input
  $input.addEventListener('input', (event) => {
    if (isSuggestionsHidden) {
      openSuggestions()
    }

    suggestionIndex = null // Typing in input, no current highlight of suggestion, reset selection index

    const value = event?.target?.value

    if (value) {
      showCloseButton()
    } else {
      hideCloseButton()
      $suggestionsContainer.scrollTop = 0 // Move suggestions window scroll bar to top
    }

    populateSuggestions({ value, suggestionIndex })
  })

  // Mainly keyboard navigational events
  $input.addEventListener('keydown', (event) => {
    const code = event.code.toLowerCase()
    const value = event.target.value

    if ((code === 'backspace' && !value) || code === 'escape') {
      closeSuggestions()
    }

    // Tab rather than blur is used to hide suggestions, as blur fires when clicking suggestion in suggestions container
    if (code === 'tab') {
      closeSuggestions()
      dispatchBlurEvent()
    }

    if (code === 'arrowup') {
      if (isNull(suggestionIndex)) {
        suggestionIndex = suggestionsLength - 1
      } else {
        suggestionIndex--
      }

      if (suggestionIndex < 0) {
        suggestionIndex = suggestionsLength - 1
      }
    }

    if (code === 'arrowdown') {
      if (isNull(suggestionIndex)) {
        suggestionIndex = 0
      } else {
        suggestionIndex++
      }

      if (suggestionIndex > suggestionsLength - 1) {
        suggestionIndex = 0
      }

      if (!isSuggestionsOpen()) {
        openSuggestions()
      }
    }

    if (['arrowup', 'arrowdown'].includes(code)) {
      const $filteredSuggestions = populateSuggestions({
        value,
        suggestionIndex
      })

      const $currentSuggestion = $filteredSuggestions.at(suggestionIndex)

      if ($currentSuggestion) {
        const { height, y: currentSuggestionY } =
          $currentSuggestion.getBoundingClientRect()
        const { height: containerHeight } =
          $suggestionsContainer.getBoundingClientRect()

        const heightBoundary = Math.round(containerHeight - height * 1.25)
        const startScrolling = Math.round(containerHeight / height)

        if (code === 'arrowdown') {
          if (suggestionIndex >= startScrolling) {
            $suggestionsContainer.scroll(0, currentSuggestionY - heightBoundary)
          } else {
            $suggestionsContainer.scroll(0, 0)
          }
        }

        if (code === 'arrowup') {
          if (suggestionIndex <= startScrolling) {
            $suggestionsContainer.scroll(0, height * suggestionIndex)
          } else {
            $suggestionsContainer.scroll(0, $suggestionsContainer.scrollHeight)
          }
        }
      }
    }

    if (code === 'enter') {
      if (!isNull(suggestionIndex)) {
        // User has used arrow keys to make selection of a suggestion and pressed enter
        const $filteredSuggestions = populateSuggestions({ value })
        const $currentSuggestion = $filteredSuggestions?.at(suggestionIndex)

        $input.value = $currentSuggestion.dataset?.text ?? ''
      }

      if ($input.value) {
        closeSuggestions()
        showCloseButton()
      } else {
        openSuggestions()
        hideCloseButton()
      }
    }
  })

  $suggestionsContainer.addEventListener('click', (event) => {
    event.stopPropagation()

    const suggestion = event?.target?.closest(
      '.app-autocomplete-dropdown__suggestion'
    )
    const text = suggestion?.dataset?.text ?? ''

    if (suggestion) {
      $input.value = text

      dispatchSubmitEvent()
      populateSuggestions({
        value: text,
        suggestionIndex
      })

      closeSuggestions()
      showCloseButton()
    }
  })
}

export { autocompleteDropdown }
