import getFormData from 'get-form-data'
import { debounce, pickBy } from 'lodash'

import { xhrRequest } from '~/src/client/common/helpers/xhr'

function handleFormSubmit(event) {
  const form = event.target.closest('form')

  if (event?.submitter?.tagName?.toLowerCase() === 'button') {
    // Non xhr button form submit
    form.requestSubmit()
  } else {
    // xhr form submit
    event.preventDefault()

    submitForm(form)
      .catch((error) => {
        throw new Error(error)
      })
      .finally(() => {
        // Re-focus the initial input
        const submittingInput = document.getElementById(event?.target?.id)

        if (submittingInput) {
          submittingInput.focus()
        }
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
