import qs from 'qs'

import { addHistoryListener } from '../../../../client/common/helpers/xhr.js'

/**
 * Search module functionality. A simple search module that handles
 * the search input, clear button, and form submission. This is usually paired with the `auto-submit` module
 * functionality
 * @param {HTMLElement} $module
 */
function search($module) {
  if (!$module) {
    return
  }

  addHistoryListener()

  const queryParams = qs.parse(location?.search, { ignoreQueryPrefix: true })
  const hasSearchResultError = $module.dataset?.hasSearchResultError === 'true'

  /** @type {HTMLInputElement} */
  const $input = $module.querySelector(`[data-js="app-search-input"]`)
  const $noJsSubmitButton = $input.form.querySelector(
    '[data-js="app-no-js-submit-button"]'
  )
  const $clearButton = $module.querySelector(
    `[data-js="app-search-clear-button"]`
  )

  const dispatchSubmitEvent = () =>
    $input.form.dispatchEvent(new Event('submit', { bubbles: true }))

  const showCloseButton = () => {
    $clearButton.classList.add('app-search__clear-button--show')
    $clearButton.setAttribute('aria-hidden', 'false')
  }

  const hideCloseButton = () => {
    $clearButton.classList.remove('app-search__clear-button--show')
    $clearButton.setAttribute('aria-hidden', 'true')
  }

  document.addEventListener('DOMContentLoaded', () => {
    $noJsSubmitButton?.remove()

    const queryParamInputValue = queryParams?.[$input.name]

    if (queryParamInputValue && !$input.value) {
      $input.value = queryParamInputValue
    }

    if ($input.value) {
      showCloseButton()

      if (!hasSearchResultError) {
        dispatchSubmitEvent()
      }
    }
  })

  $clearButton.addEventListener('click', () => {
    $input.value = ''
    $input.focus()

    dispatchSubmitEvent()
    hideCloseButton()
  })

  // User typing inside input
  $input.addEventListener('input', (event) => {
    const value = event?.target?.value

    if (value) {
      showCloseButton()
    } else {
      hideCloseButton()
    }
  })

  // Enter pressed in input
  $input.addEventListener('keydown', (event) => {
    const code = event.code.toLowerCase()

    if (code === 'enter') {
      if ($input.value) {
        showCloseButton()
      } else {
        hideCloseButton()
      }
    }
  })
}

export { search }
