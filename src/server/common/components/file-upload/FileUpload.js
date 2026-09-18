import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
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
      uploads: window.cdp.uploadManager.getUploads()
    })
  }

  #onProgress() {
    this.render({
      uploads: window.cdp.uploadManager.getUploads()
    })
  }

  #onComplete() {
    const uploads = window.cdp.uploadManager.getUploads()

    this.render({
      uploads
    })

    if (!uploads.some((upload) => upload.status === 'uploading')) {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  #onFailed() {
    this.render({
      uploads: window.cdp.uploadManager.getUploads()
    })
  }
}

window.customElements.define('file-upload', FileUpload)
