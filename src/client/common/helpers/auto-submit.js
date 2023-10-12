import getFormData from 'get-form-data'
import { debounce, pickBy } from 'lodash'

import { xhrRequest } from '~/src/client/common/helpers/xhr'

function handleFormSubmit(event) {
  const form = event.target.closest('form')
  const xhrElement = form.querySelector('[data-xhr]')
  const xhrElementChildrenCanSubmit =
    xhrElement.dataset.childrenCanSubmit ?? false

  // By default, we do not wish input interactions inside a forms xhr element to submit the form. This can be bypassed
  if (xhrElement.contains(event.target) && !xhrElementChildrenCanSubmit) {
    return
  }

  if (event?.submitter?.tagName?.toLowerCase() === 'button') {
    // Form button pressed or enter pressed inside form input
    form.requestSubmit()
  } else {
    // xhr form auto submit
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
