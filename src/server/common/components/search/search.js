import qs from 'qs'
import { addHistoryListener } from '../../../../client/common/helpers/xhr.js'

function search($module) {
  if (!$module) {
    return
  }

  // Setup Xhr history listener
  addHistoryListener()

  const $input = $module.querySelector(`[data-js="app-search-input"]`)
  const $noJsSubmitButton = $input.form.querySelector(
    '[data-js="app-no-js-submit-button"]'
  )
  const queryParams = qs.parse(location?.search, { ignoreQueryPrefix: true })
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

    const queryParamValue = queryParams?.[$input.name]

    if (queryParamValue) {
      $input.value = queryParamValue
      showCloseButton()
    }

    if (!queryParamValue) {
      if ($input.value) {
        showCloseButton()
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
