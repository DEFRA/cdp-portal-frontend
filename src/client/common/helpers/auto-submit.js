import { debounce } from 'lodash'

import { xhrRequest } from '~/src/client/common/helpers/xhr'
import { formItemsToObject } from '~/src/client/common/helpers/form-items-to-object'

function handleFormSubmit(event) {
  event.preventDefault()

  submitForm(event.target.closest('form')).catch((error) => {
    throw new Error(error)
  })
}

async function submitForm($form) {
  if ($form.dataset.isSubmitting === 'true') {
    return
  }

  $form.dataset.isSubmitting = 'true'

  const formElementsObj = formItemsToObject(
    Array.from($form.elements).filter(($element) => $element.type !== 'submit')
  )

  try {
    await xhrRequest($form.action, formElementsObj)
    $form.dataset.isSubmitting = 'false'
  } catch (error) {
    $form.dataset.isSubmitting = 'false'
  }
}

function autoSubmit($form) {
  if (!$form) {
    return
  }

  $form.addEventListener('input', debounce(handleFormSubmit, 200)) // minimal debounce whilst user is typing
  $form.addEventListener('submit', handleFormSubmit)
}

export { autoSubmit }
