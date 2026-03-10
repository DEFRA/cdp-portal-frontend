import getFormData from 'get-form-data'
import omit from 'lodash/omit.js'
import pickBy from 'lodash/pickBy.js'
import { xhrRequest } from './xhr.js'

async function refresh(event) {
  const $form = event.target.closest('form')
  if ($form.dataset.isSubmitting === 'true') {
    return
  }

  $form.dataset.isSubmitting = 'true'

  const query = omit(pickBy(getFormData($form)), ['csrfToken'])

  await xhrRequest(
    `${location.protocol}//${location.host}${location.pathname}`,
    query
  )

  $form.dataset.isSubmitting = 'false'
}

export default function autoRefresh($input) {
  if (!$input) {
    return
  }

  $input.addEventListener('change', refresh)
}
