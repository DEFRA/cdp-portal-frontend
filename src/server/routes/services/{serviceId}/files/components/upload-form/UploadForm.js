import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import { xhrPostRequest } from '#client/common/helpers/xhr.js'
import { clientNotification } from '#client/common/helpers/client-notification.js'
import UploadManager from './UploadManager.js'

window.cdp = window.cdp ?? {}
window.cdp.uploadManager = window.cdp.uploadManager ?? new UploadManager()

export default class UploadForm extends NunjucksComponent {
  static get observedAttributes() {
    return ['data-status']
  }

  #form
  #onSubmitHandler

  constructor() {
    super()
    this.#onSubmitHandler = this.#onSubmit.bind(this)
  }

  mounted() {
    this.#form = this.querySelector('form')
    this.#form.addEventListener('submit', this.#onSubmitHandler)
  }

  dismounted() {
    this.#form.removeEventListener('submit', this.#onSubmitHandler)
  }

  render() {
    // override to prevent render
  }

  async #onSubmit(event) {
    event.preventDefault()

    this.#form.dataset.isSubmitting = 'true'

    const files = this.#form.querySelector('input[name="files"]')?.files ?? []

    window.cdp.uploadManager.startUpload(files)

    const payload = {
      csrfToken: this.#form.querySelector('input[name="csrfToken"]').value,
      filesMeta: JSON.stringify(
        Array.from(files).map(({ name, size }) => ({
          name,
          size
        }))
      )
    }

    const { ok } = await xhrPostRequest(location.href, payload)

    if (ok) {
      // startUpload()
    } else {
      clientNotification('Loading failed, please refresh the page')
    }

    this.#form.dataset.isSubmitting = 'false'
  }
}

window.customElements.define('upload-form', UploadForm)
