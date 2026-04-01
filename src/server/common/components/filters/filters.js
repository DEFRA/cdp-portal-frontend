import debounce from 'lodash/debounce.js'
import isFunction from 'lodash/isFunction.js'

import { xhrRequest } from '#client/common/helpers/xhr.js'
import { clientNotification } from '#client/common/helpers/client-notification.js'

function filters($form) {
  if (!$form) {
    return
  }

  const $clearAll = $form.querySelector('[data-js="app-filters-clear-all"]')

  if ($clearAll) {
    const clearAllFiltersName = $clearAll.dataset.clearAll
    const clearFiltersFunction = window.cdp[clearAllFiltersName]

    if (!isFunction(clearFiltersFunction)) {
      return
    }

    $clearAll.addEventListener('click', clearFiltersFunction)
  }
  const minimalDebounce = 200
  $form.addEventListener('input', debounce(handleFormInput, minimalDebounce)) // minimal debounce whilst user is typing
  $form.addEventListener('change', debounce(handleFormChange, minimalDebounce))
}

function handleFormInput(event) {
  const form = event.target.closest('form')
  event.preventDefault()

  if (event.target.dataset?.typeahead === 'true') {
    submitForm(form).catch((error) => {
      clientNotification(error)
    })
  }
}

function handleFormChange(event) {
  const form = event.target.closest('form')
  event.preventDefault()

  submitForm(form).catch((error) => {
    clientNotification(error)
  })
}

async function submitForm($form) {
  if ($form.dataset.isSubmitting === 'true') {
    return
  }

  $form.dataset.isSubmitting = 'true'

  const loaderName = $form.dataset.loaderName
  let loader
  if (loaderName) {
    loader = document.querySelector(`[data-js='${loaderName}']`)
    if (loader) {
      loader.classList.add('app-loader--is-loading')
    }
  }

  const queryParams = Array.from($form.elements).reduce(
    (validElements, element) => {
      if (element.name && element.value) {
        return {
          ...validElements,
          [element.name]: element.value.trim()
        }
      }
      return validElements
    },
    {}
  )

  const result = await xhrRequest($form.action, queryParams)

  $form.dataset.isSubmitting = 'false'

  if (loader) {
    loader.classList.remove('app-loader--is-loading')
  }

  if (!result.ok) {
    throw new Error('Filtering failed, please refresh the page')
  }
}

export { filters }
