import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import { formatFileSize } from '#config/nunjucks/filters/filters.js'
import UploadManager from './UploadManager.js'

window.cdp = window.cdp ?? {}
window.cdp.uploadManager = window.cdp.uploadManager ?? new UploadManager()


export default class FileUpload extends NunjucksComponent {
  #form
  #onSubmitHandler
  #onProgressHandler


  constructor() {
    super(template)

    this.#onSubmitHandler = this.#onSubmit.bind(this)
    this.#onProgressHandler = this.#onProgress.bind(this)
  }

  mounted() {
    this.#form = this.querySelector('form')
    this.#form.addEventListener('submit', this.#onSubmitHandler)

    window.cdp.uploadManager.addEventListener(
      'progress',
      this.#onProgressHandler
    )
  }

  dismounted() {
    this.#form.addEventListener('submit', this.#onSubmitHandler)

    window.cdp.uploadManager.removeEventListener(
      'progress',
      this.#onProgressHandler
    )
  }

  #onSubmit(event) {
    event.preventDefault()

    this.#form.dataset.isSubmitting = 'true'

    const files = this.#form.querySelector('input[name="files"]')?.files ?? []

    window.cdp.uploadManager.startUpload(files)

    this.render({
      filesMeta: window.cdp.uploadManager.getFilesMeta()
    })
  }


  #onProgress(event) {
    const file = event.detail

    // const filesMeta = window.cdp.uploadManager.getFilesMeta()

    const $progress = document.getElementById(`upload-progress-${file.name}`)

    if ($progress) {
      $progress.setAttribute('data-progress', file.progress)
      $progress.setAttribute(
        'data-complete',
        formatFileSize(file.bytesUploaded)
      )
    }

    // this.render({
    //   filesMeta
    // })
  }
}

window.customElements.define('file-upload', FileUpload)
