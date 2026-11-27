import getFormData from 'get-form-data'
import debounce from 'lodash/debounce.js'
import omit from 'lodash/omit.js'
import pickBy from 'lodash/pickBy.js'

import { xhrRequest } from './xhr.js'

const pendingRequests = new WeakMap()

function handleFormSubmit(event) {
  const form = event.target.closest('form')

  if (!form) {
    return
  }

  // Allow native form submissions when explicitly configured
  if (event.type === 'submit' && form.dataset.autoSubmitSubmit === 'false') {
    return
  }

  const xhrElement = [...form.querySelectorAll('[data-xhr]')].find((element) =>
    element.contains(event.target)
  )

  const xhrElementChildrenCanSubmit =
    xhrElement?.dataset.childrenCanSubmit === 'true'

  // By default, interactions inside XHR results do not submit the form
  if (xhrElement && !xhrElementChildrenCanSubmit) {
    return
  }

  if (event?.submitter?.tagName?.toLowerCase() === 'button') {
    form.requestSubmit()
  } else {
    event.preventDefault()

    const xhrTarget =
      event.target.closest('[data-xhr-target]')?.dataset.xhrTarget

    submitForm(form, xhrTarget)
      .finally(() => {
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

async function submitForm($form, xhrTarget) {
  const query = omit(pickBy(getFormData($form)), ['csrfToken'])

  const nextRequest = { query, xhrTarget }

  if ($form.dataset.isSubmitting === 'true') {
    pendingRequests.set($form, nextRequest)
    return
  }

  $form.dataset.isSubmitting = 'true'

  try {
    let request = nextRequest

    while (request) {
      pendingRequests.delete($form)

      if (request.xhrTarget) {
        await xhrRequest($form.action, request.query, request.xhrTarget)
      } else {
        await xhrRequest($form.action, request.query)
      }

      request = pendingRequests.get($form)
    }
  } finally {
    $form.dataset.isSubmitting = 'false'
    pendingRequests.delete($form)
  }
}

function autoSubmit($form) {
  if (!$form) {
    return
  }

  $form.addEventListener('input', debounce(handleFormSubmit, 300))
  $form.addEventListener('submit', handleFormSubmit)
}

export { autoSubmit }
