import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import { formatFileSize } from '#config/nunjucks/filters/filters.js'
import UploadManager from './UploadManager.js'

window.cdp = window.cdp ?? {}
window.cdp.uploadManager = window.cdp.uploadManager ?? new UploadManager()

export default class FileUpload extends NunjucksComponent {
  #onSubmitHandler
  #onProgressHandler
  #onCompleteHandler
  #onFailedHandler

  constructor() {
    super(template)

    this.#onSubmitHandler = this.#onSubmit.bind(this)
    this.#onProgressHandler = this.#onProgress.bind(this)
    this.#onCompleteHandler = this.#onComplete.bind(this)
    this.#onFailedHandler = this.#onFailed.bind(this)
  }

  mounted() {
    this.addEventListener('submit', this.#onSubmitHandler)

    window.cdp.uploadManager.addEventListener(
      'progress',
      this.#onProgressHandler
    )
    window.cdp.uploadManager.addEventListener(
      'complete',
      this.#onCompleteHandler
    )
    window.cdp.uploadManager.addEventListener('failed', this.#onFailedHandler)
  }

  dismounted() {
    this.removeEventListener('submit', this.#onSubmitHandler)

    window.cdp.uploadManager.removeEventListener(
      'progress',
      this.#onProgressHandler
    )
    window.cdp.uploadManager.removeEventListener(
      'complete',
      this.#onCompleteHandler
    )
    window.cdp.uploadManager.removeEventListener(
      'failed',
      this.#onFailedHandler
    )
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

    if (filesMeta.every((file) => file.status === 'complete')) {
      window.location.reload()
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
