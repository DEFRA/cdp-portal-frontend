import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import { formatFileSize } from '#config/nunjucks/filters/filters.js'
import UploadManager from './UploadManager.js'

window.cdp = window.cdp ?? {}
window.cdp.uploadManager = window.cdp.uploadManager ?? new UploadManager()

export default class FileUpload extends NunjucksComponent {
  constructor() {
    super(template)
  }

  get managedListeners() {
    return [
      [this, 'submit', this.#onSubmit],
      [window.cdp.uploadManager, 'progress', this.#onProgress],
      [window.cdp.uploadManager, 'complete', this.#onComplete],
      [window.cdp.uploadManager, 'failed', this.#onFailed]
    ]
  }

  #onSubmit(event) {
    event.preventDefault()

    const $form = this.querySelector('form')
    const files = $form.querySelector('input[name="files"]')?.files ?? []

    window.cdp.uploadManager.startUpload(
      this.dataset.service,
      this.dataset.path,
      files,
      this.dataset.csrftoken
    )

    this.render({
      filesMeta: window.cdp.uploadManager.getFilesMeta()
    })
  }

  #onProgress(event) {
    const file = event.detail

    const $progress = document.getElementById(
      `upload-progress-${encodeURIComponent(file.name)}`
    )

    if ($progress) {
      $progress.setAttribute('data-progress', file.progress)
      $progress.setAttribute(
        'data-complete',
        formatFileSize(file.bytesUploaded)
      )
    }
  }

  #onComplete(event) {
    const file = event.detail

    const $progress = document.getElementById(
      `upload-progress-${encodeURIComponent(file.name)}`
    )

    if ($progress) {
      $progress.setAttribute('data-progress', file.progress)
      $progress.setAttribute(
        'data-complete',
        formatFileSize(file.bytesUploaded)
      )
    }

    const $button = document.getElementById(
      `upload-button-${encodeURIComponent(file.name)}`
    )

    if ($button) {
      $button.setAttribute('data-status', 'complete')
    }

    const filesMeta = window.cdp.uploadManager.getFilesMeta()

    if (!filesMeta.some((file) => file.status === 'uploading')) {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  #onFailed(event) {
    const file = event.detail

    const $button = document.getElementById(
      `upload-button-${encodeURIComponent(file.name)}`
    )

    if ($button) {
      $button.setAttribute('data-status', 'failed')
    }
  }
}

window.customElements.define('file-upload', FileUpload)
