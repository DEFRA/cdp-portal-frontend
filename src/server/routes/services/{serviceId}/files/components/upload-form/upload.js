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
    startUpload()
  } else {
    clientNotification('Loading failed, please refresh the page')
  }

  $form.dataset.isSubmitting = 'false'
}

const fileSize = 129456

function startUpload() {
  let progress = 0
  let bytes = 0

  const interval = setInterval(() => {
    bytes += 10
    progress = Math.round((bytes / fileSize) * 100)

    const $progress = document.getElementById(
      'upload-progress-59112_292802ecca29e95423e18627cf2759da.jpg'
    )
    $progress.querySelector('.app-progress__indicator').style.width =
      `${progress}%`

    $progress.querySelector('.app-progress__readout').textContent =
      `${bytes} / ${fileSize}`

    if (progress >= 100) {
      clearInterval(interval)
    }
  }, 1)
}

window.startTest = startUpload
