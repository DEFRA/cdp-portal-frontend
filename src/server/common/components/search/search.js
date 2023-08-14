import qs from 'qs'
import { isNull } from 'lodash'

function createSuggestion() {
  const li = document.createElement('li')

  li.classList.add('app-search__suggestion')
  li.setAttribute('role', 'option')
  li.setAttribute('tabindex', '-1')
  li.setAttribute('aria-selected', 'false')

  return li
}

function buildSuggestion(item, listElement) {
  const li = listElement.cloneNode(true)

  li.dataset.value = item.value
  li.textContent = item.text

  return li
}

function manipulateSuggestion({ value, suggestionIndex } = {}) {
  return ($suggestion, index) => {
    manageTextHighlight($suggestion, value)
    manageChoiceHighlight($suggestion, index, suggestionIndex)

    return $suggestion
  }
}

function manageTextHighlight($suggestion, value = null) {
  if (value) {
    $suggestion.innerHTML = $suggestion.dataset?.value.replace(
      new RegExp(value, 'gi'),
      `<strong>$&</strong>`
    )
  } else {
    $suggestion.innerHTML = $suggestion.dataset?.value
  }

  return $suggestion
}

function manageChoiceHighlight($suggestion, index, suggestionIndex = null) {
  const className = 'app-search__suggestion--highlight'

  if (suggestionIndex === index) {
    $suggestion.classList.add(className)
    $suggestion.setAttribute('aria-selected', true)
  } else {
    $suggestion.classList.remove(className)
    $suggestion.setAttribute('aria-selected', false)
  }

  return $suggestion
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

  const $input = $module.querySelector(`[data-js="app-search-input"]`)
  const $submitButton = $input.form.querySelector(
    `[data-js="app-entity-actions-submit-button"]`
  )
  const suggestions = window.suggestions?.[$input.name] ?? []
  const queryParams = qs.parse(location?.search, { ignoreQueryPrefix: true })

  const suggestionElement = createSuggestion()
  const $suggestions = suggestions
    .filter((suggestion) => Boolean(suggestion.value))
    .map((suggestion) => buildSuggestion(suggestion, suggestionElement))

  const $clearButton = $module.querySelector(
    `[data-js="app-search-clear-button"]`
  )
  const $suggestionsContainer = $module.querySelector(
    `[data-js="app-search-suggestions"]`
  )

  const isSuggestionsHidden = !$suggestionsContainer.classList.contains(
    'app-search__suggestions--show'
  )

  let suggestionIndex = null

  const isSuggestionsOpen = () =>
    $input?.getAttribute('aria-expanded') === 'true'

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
      .map(manipulateSuggestion({ value, suggestionIndex }))

    return $filteredSuggestions.length
      ? $filteredSuggestions
      : [buildNoResults()]
  }

  /**
   * Reset selection and text highlighting
   * @returns {*[]|HTMLLIElement[]}
   */
  const resetSuggestions = () => {
    const $resetSuggestions = $suggestions.map(manipulateSuggestion())

    return $resetSuggestions.length ? $resetSuggestions : [buildNoResults()]
  }

  const dispatchSubmitEvent = () =>
    $input.form.dispatchEvent(new Event('submit', { bubbles: true }))

  const dispatchDocumentClickEvent = () =>
    document.dispatchEvent(new Event('click', { bubbles: true }))

  const dispatchBlurEvent = () =>
    $input.dispatchEvent(new Event('blur', { bubbles: true }))

  const openSuggestions = () => {
    suggestionIndex = null
    $suggestionsContainer.scrollTop = 0
    $suggestionsContainer.classList.add('app-search__suggestions--show')
    $suggestionsContainer.setAttribute('aria-live', 'polite')

    $input.setAttribute('aria-expanded', 'true')
  }

  const closeSuggestions = () => {
    suggestionIndex = null
    $suggestionsContainer.scrollTop = 0
    $suggestionsContainer.classList.remove('app-search__suggestions--show')
    $suggestionsContainer.setAttribute('aria-live', 'off')

    $input.setAttribute('aria-expanded', 'false')
  }

  const showCloseButton = () => {
    $clearButton.classList.add('app-search__clear-button--show')
    $clearButton.setAttribute('aria-hidden', 'false')
  }

  const hideCloseButton = () => {
    $clearButton.classList.remove('app-search__clear-button--show')
    $clearButton.setAttribute('aria-hidden', 'true')
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

  $clearButton.addEventListener('click', () => {
    $input.value = ''
    $input.focus()

    dispatchSubmitEvent()
    hideCloseButton()
    populateSuggestions()
  })

  // Click outside Search component
  document.addEventListener('click', (event) => {
    if (event.target !== $input && event.target !== $submitButton) {
      closeSuggestions()
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

    openSuggestions()
  })

  // Mouse clicks into the input
  $input.addEventListener('click', (event) => {
    dispatchDocumentClickEvent()

    event.stopPropagation()

    const value = event?.target?.value

    if (value) {
      populateWithFilteredSuggestions({ value })
    } else {
      populateSuggestions()
    }

    openSuggestions()
  })

  // User typing inside input
  $input.addEventListener('input', (event) => {
    if (isSuggestionsHidden) {
      openSuggestions()
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
      closeSuggestions()
    }

    // tab rather than blur is used to hide suggestions, as blur fires when clicking suggestions
    if (code === 'tab') {
      closeSuggestions()
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

      if (!isSuggestionsOpen()) {
        openSuggestions()
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

    if (event?.target?.tagName.toLowerCase() === 'li') {
      $input.value = event?.target?.dataset?.value ?? ''
      dispatchSubmitEvent()
      closeSuggestions()
      showCloseButton()
    }
  })
}

export { search }
