import getFormData from 'get-form-data'
import { xhrPostRequest } from './xhr.js'

export default function autoRefresh($input) {
  if (!$input) {
    return
  }

  $input.addEventListener('change', refresh)
}

async function refresh(event) {
  const $form = event.target.closest('form')
  if ($form.dataset.isSubmitting === 'true') {
    return
  }

  const loaderName = $form.dataset.autoRefreshLoader
  let loader
  if (loaderName) {
    loader = document.querySelector(`[data-js="${loaderName}"]`)
    loader.classList.add('app-loader--is-loading')
  }

  $form.dataset.isSubmitting = 'true'

  const payload = getFormData($form)

  await xhrPostRequest(
    `${location.protocol}//${location.host}${location.pathname}`,
    payload
  )

  if (loader) {
    loader.classList.remove('app-loader--is-loading')
  }

  $form.dataset.isSubmitting = 'false'
}
