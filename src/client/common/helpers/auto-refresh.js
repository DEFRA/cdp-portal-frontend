import getFormData from 'get-form-data'
import { xhrPostRequest } from './xhr.js'

async function refresh(event) {
  const $form = event.target.closest('form')
  if ($form.dataset.isSubmitting === 'true') {
    return
  }

  $form.dataset.isSubmitting = 'true'

  const payload = getFormData($form)

  await xhrPostRequest(
    `${location.protocol}//${location.host}${location.pathname}`,
    payload
  )

  $form.dataset.isSubmitting = 'false'
}

export default function autoRefresh($input) {
  if (!$input) {
    return
  }

  $input.addEventListener('change', refresh)
}
