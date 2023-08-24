import getFormData from 'get-form-data'
import { debounce, pickBy } from 'lodash'

import { xhrRequest } from '~/src/client/common/helpers/xhr'

function handleFormSubmit(event) {
  event.preventDefault()

  const form = event.target.closest('form')

  if (event?.submitter?.tagName?.toLowerCase() === 'button') {
    // Non xhr form submit
    form.submit()
  } else {
    // xhr form submit
    submitForm(form).catch((error) => {
      throw new Error(error)
    })
  }
}

async function submitForm($form) {
  if ($form.dataset.isSubmitting === 'true') {
    return
  }

  $form.dataset.isSubmitting = 'true'

  const query = pickBy(getFormData($form))

  try {
    await xhrRequest($form.action, query)
    $form.dataset.isSubmitting = 'false'
  } catch (error) {
    $form.dataset.isSubmitting = 'false'
  }
}

function autoSubmit($form) {
  if (!$form) {
    return
  }

  $form.addEventListener('input', debounce(handleFormSubmit, 300)) // minimal debounce whilst user is typing
  $form.addEventListener('submit', handleFormSubmit)
}

export { autoSubmit }
