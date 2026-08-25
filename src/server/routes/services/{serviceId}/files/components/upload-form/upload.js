import { xhrPostRequest } from '#client/common/helpers/xhr.js'
import { clientNotification } from '#client/common/helpers/client-notification.js'

export default function upload($form) {
  if (!($form instanceof HTMLFormElement)) {
    return
  }

  $form.addEventListener('submit', onSubmit)
}

async function onSubmit(event) {
  event.preventDefault()
  const $form = event.target.closest('form')

  $form.dataset.isSubmitting = 'true'

  // TODO: Can this be stored "above" window
  window.cdp.uploadeFiles =
    $form.querySelector('input[name="files"]')?.files ?? []

  const payload = {
    csrfToken: $form.querySelector('input[name="csrfToken"]').value,
    filesMeta: JSON.stringify(
      Array.from(window.cdp.uploadeFiles).map(({ name, size }) => ({
        name,
        size
      }))
    )
  }

  const { ok } = await xhrPostRequest(location.href, payload)

  if (ok) {
    $form.style.display = 'none'
  } else {
    clientNotification('Loading failed, please refresh the page')
  }

  $form.dataset.isSubmitting = 'false'
}
