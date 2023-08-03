import qs from 'qs'
import { isNull } from 'lodash'

function buildSuggestion(item) {
  const li = document.createElement('li')

  li.classList.add('app-search__suggestion')
  li.setAttribute('role', 'option')
  li.setAttribute('tabindex', '-1')
  li.setAttribute('aria-selected', 'false')
  li.dataset.value = item.value
  li.textContent = item.value

  return li
}

/**
 * Highlight the match from the input in the suggestion
 * @param value
 * @returns {function(*): *}
 */
function manageTextHighlight(value = null) {
  return ($item) => {
    if (value) {
      $item.innerHTML = $item.dataset?.value.replace(
        new RegExp(value, 'gi'),
        `<strong>$&</strong>`
      )
    } else {
      $item.innerHTML = $item.dataset?.value
    }

    return $item
  }
}

/**
 * Highlight which suggestion the user has navigated with arrows to
 * @param currentSuggestion
 * @returns {function(*, *): *}
 */
function manageChoiceHighlight(currentSuggestion = null) {
  return ($item, index) => {
    const className = 'app-search__suggestion--highlight'

    if (currentSuggestion === index) {
      $item.classList.add(className)
      $item.setAttribute('aria-selected', true)
    } else {
      $item.classList.remove(className)
      $item.setAttribute('aria-selected', false)
    }

    return $item
  }
}

function buildNoResults() {
  const li = document.createElement('li')

  li.classList.add(
    'app-search__suggestion',
    'app-search__suggestion--no-results'
  )
  li.setAttribute('role', 'option')
  li.textContent = 'No results'

  return li
}

function search($module) {
  if (!$module) {
    return
  }

  const suggestions = window.suggestions ?? []
  const queryParams = qs.parse(location?.search, { ignoreQueryPrefix: true })
  const $suggestions = suggestions.map(buildSuggestion)

  const $input = $module.querySelector(`[data-js="app-search-input"]`)
  const $closeButton = $module.querySelector(
    `[data-js="app-search-close-button"]`
  )
  const $suggestionsContainer = $module.querySelector(
    `[data-js="app-search-suggestions"]`
  )

  const isSuggestionsHidden = !$suggestionsContainer.classList.contains(
    'app-search__suggestions--show'
  )

  let suggestionIndex = null

  /**
   * Filter suggestions and provide selection and text highlighting
   * @param value
   * @param suggestionIndex
   * @returns {*[]|HTMLLIElement[]}
   */
  const filterSuggestions = ({ value, suggestionIndex } = {}) => {
    const $filteredSuggestions = $suggestions
      .filter(($item) =>
        $item.dataset?.value.toLowerCase().includes(value.toLowerCase())
      )
      .map(manageTextHighlight(value))
      .map(manageChoiceHighlight(suggestionIndex))

    return $filteredSuggestions.length
      ? $filteredSuggestions
      : [buildNoResults()]
  }

  /**
   * Reset selection and text highlighting
   * @returns {*[]|HTMLLIElement[]}
   */
  const resetSuggestions = () => {
    const $resetSuggestions = $suggestions
      .map(manageChoiceHighlight())
      .map(manageTextHighlight())

    return $resetSuggestions.length ? $resetSuggestions : [buildNoResults()]
  }

  const dispatchSubmitEvent = () =>
    $input.form.dispatchEvent(new Event('submit', { bubbles: true }))

  const dispatchBlurEvent = () =>
    $input.dispatchEvent(new Event('blur', { bubbles: true }))

  const showSuggestions = () => {
    suggestionIndex = null
    $suggestionsContainer.scrollTop = 0
    $suggestionsContainer.classList.add('app-search__suggestions--show')
    $suggestionsContainer.setAttribute('aria-live', 'polite')
  }

  const hideSuggestions = () => {
    suggestionIndex = null
    $suggestionsContainer.scrollTop = 0
    $suggestionsContainer.classList.remove('app-search__suggestions--show')
    $suggestionsContainer.setAttribute('aria-live', 'off')
  }

  const showCloseButton = () => {
    $closeButton.classList.add('app-search__close-button--show')
    $closeButton.setAttribute('aria-hidden', 'false')
  }

  const hideCloseButton = () => {
    $closeButton.classList.remove('app-search__close-button--show')
    $closeButton.setAttribute('aria-hidden', 'true')
  }

  const populateSuggestions = () =>
    $suggestionsContainer.replaceChildren(...resetSuggestions())

  /**
   * Populate filtered suggestions or no results message
   * @param value
   * @param suggestionIndex
   * @returns {*[]|HTMLLIElement[]}
   */
  const populateWithFilteredSuggestions = ({ value, suggestionIndex }) => {
    const $filteredSuggestions = filterSuggestions({
      value,
      suggestionIndex
    })

    $suggestionsContainer.replaceChildren(...$filteredSuggestions)

    return $filteredSuggestions
  }

  document.addEventListener('DOMContentLoaded', () => {
    const queryParamValue = queryParams?.[$input.name]

    if (queryParamValue) {
      $input.value = queryParamValue
      showCloseButton()
    }

    populateSuggestions()
  })

  $closeButton.addEventListener('click', () => {
    $input.value = ''
    $input.focus()

    dispatchSubmitEvent()
    hideCloseButton()
    populateSuggestions()
  })

  // Click outside Search component
  document.addEventListener('click', (event) => {
    if (!$module.contains(event.target)) {
      hideSuggestions()
      resetSuggestions()
    }
  })

  // User focus into the input
  $input.addEventListener('focus', (event) => {
    const value = event?.target?.value

    if (value) {
      populateWithFilteredSuggestions({ value })
    } else {
      populateSuggestions()
    }

    showSuggestions()
  })

  // Mouse clicks into the input
  $input.addEventListener('click', (event) => {
    event.stopPropagation()

    const value = event?.target?.value

    if (value) {
      populateWithFilteredSuggestions({ value })
    } else {
      populateSuggestions()
    }

    showSuggestions()
  })

  // User typing inside input
  $input.addEventListener('input', (event) => {
    if (isSuggestionsHidden) {
      showSuggestions()
    }

    suggestionIndex = null // Typing in input, so no suggestion selection made

    const value = event?.target?.value

    if (value) {
      showCloseButton()
    } else {
      hideCloseButton()
      $suggestionsContainer.scrollTop = 0 // Move suggestions window scroll bar to top
    }

    populateWithFilteredSuggestions({ value })
  })

  // Mainly keyboard navigational events
  $input.addEventListener('keydown', (event) => {
    const code = event.code.toLowerCase()
    const value = event.target.value

    if ((code === 'backspace' && !value) || code === 'escape') {
      hideSuggestions()
    }

    // tab rather than blur is used to hide suggestions, as blur fires when clicking suggestions
    if (code === 'tab') {
      hideSuggestions()
      dispatchBlurEvent()
    }

    if (code === 'arrowup') {
      if (isNull(suggestionIndex)) {
        suggestionIndex = 0
      } else {
        suggestionIndex--
      }

      if (suggestionIndex < 0) {
        suggestionIndex = $suggestions.length - 1
      }
    }

    if (code === 'arrowdown') {
      if (isNull(suggestionIndex)) {
        suggestionIndex = 0
      } else {
        suggestionIndex++
      }

      if (suggestionIndex > $suggestions.length - 1) {
        suggestionIndex = 0
      }
    }

    if (['arrowup', 'arrowdown'].includes(code)) {
      const $filteredSuggestions = populateWithFilteredSuggestions({
        value,
        suggestionIndex
      })

      const $currentSuggestion = $filteredSuggestions.at(suggestionIndex)

      if ($currentSuggestion) {
        // When users uses up and down arrows make sure focused suggestion is scrolled into view in suggestions container
        const { height } = $currentSuggestion.getBoundingClientRect()

        $suggestionsContainer.scroll(0, height * suggestionIndex)
      }
    }

    if (code === 'enter') {
      if (!isNull(suggestionIndex)) {
        // User has used arrow keys to make selection of a suggestion and pressed enter
        const $filteredSuggestions = filterSuggestions({ value })
        const $currentSuggestion = $filteredSuggestions?.at(suggestionIndex)

        $input.value = $currentSuggestion.dataset?.value ?? ''
      }

      if ($input.value) {
        hideSuggestions()
        showCloseButton()
      } else {
        showSuggestions()
        hideCloseButton()
      }
    }
  })

  $suggestionsContainer.addEventListener('click', (event) => {
    event.stopPropagation()

    if (event?.target?.tagName.toLowerCase() === 'li') {
      $input.value = event?.target?.dataset?.value ?? ''

      dispatchSubmitEvent()
      hideSuggestions()
      showCloseButton()
    }
  })
}

export { search }
