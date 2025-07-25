import debounce from 'lodash/debounce.js'
import isFunction from 'lodash/isFunction.js'

import { xhrRequest } from '../../../../client/common/helpers/xhr.js'

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
  $form.addEventListener('input', debounce(handleFormSubmit, minimalDebounce)) // minimal debounce whilst user is typing
}

function handleFormSubmit(event) {
  const form = event.target.closest('form')
  event.preventDefault()

  submitForm(form).catch((error) => {
    throw new Error(error)
  })
}

async function submitForm($form) {
  if ($form.dataset.isSubmitting === 'true') {
    return
  }

  $form.dataset.isSubmitting = 'true'

  // TODO this shouldn't be querying for non typeahead components
  const queryParams = Array.from($form.elements).reduce(
    (validElements, element) => {
      if (element.name && element.value) {
        return {
          ...validElements,
          [element.name]: element.value
        }
      }
      return validElements
    },
    {}
  )

  await xhrRequest($form.action, queryParams)

  $form.dataset.isSubmitting = 'false'
}

export { filters }
