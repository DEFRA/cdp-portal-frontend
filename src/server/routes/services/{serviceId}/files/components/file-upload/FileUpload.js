import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import { formatFileSize } from '#config/nunjucks/filters/filters.js'

export default class FileUpload extends NunjucksComponent {
  #onProgressHandler

  constructor() {
    super(template)

    this.#onProgressHandler = this.#onProgress.bind(this)
  }

  mounted() {
    window.cdp.uploadManager.addEventListener(
      'progress',
      this.#onProgressHandler
    )
  }

  dismounted() {
    window.cdp.uploadManager.removeEventListener(
      'progress',
      this.#onProgressHandler
    )
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
