import getFormData from 'get-form-data'
import { debounce, omit, pickBy } from 'lodash'

import { xhrRequest } from '~/src/client/common/helpers/xhr'

function handleFormSubmit(event) {
  const form = event.target.closest('form')
  const xhrElement = form.querySelector('[data-xhr]')

  // TODO revisit this when the Search component UX is improved
  const xhrElementChildrenCanSubmit =
    xhrElement.dataset.childrenCanSubmit ?? false

  // TODO revisit this when there is time, its feeling too complex
  // By default, we do not wish input interactions inside a forms xhr html element to submit the form.
  // This can be bypassed by applying the data-children-can-submit="true" attribute to the xhr element
  if (xhrElement.contains(event.target) && !xhrElementChildrenCanSubmit) {
    return
  }

  if (event?.submitter?.tagName?.toLowerCase() === 'button') {
    // Form button pressed or enter pressed inside form input which triggers forms button
    form.requestSubmit()
  } else {
    // xhr form auto submit from listener in forms input
    event.preventDefault()

    submitForm(form)
      .finally(() => {
        // Re-focus the initial input
        const submittingInput = document.getElementById(event?.target?.id)

        if (submittingInput) {
          submittingInput.focus()
        }
      })
      .catch((error) => {
        throw new Error(error)
      })
  }
}

async function submitForm($form) {
  if ($form.dataset.isSubmitting === 'true') {
    return
  }

  $form.dataset.isSubmitting = 'true'

  const query = omit(pickBy(getFormData($form)), ['csrfToken'])

  await xhrRequest($form.action, query)

  $form.dataset.isSubmitting = 'false'
}

function autoSubmit($form) {
  if (!$form) {
    return
  }

  $form.addEventListener('input', debounce(handleFormSubmit, 300)) // minimal debounce whilst user is typing
  $form.addEventListener('submit', handleFormSubmit)
}

export { autoSubmit }
