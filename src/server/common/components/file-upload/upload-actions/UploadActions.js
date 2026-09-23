import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

export default class UploadActions extends NunjucksComponent {
  static get observedAttributes() {
    return ['data-status']
  }

  constructor() {
    super(template)

    this.dataset.status = 'uploading'
  }

  get managedListeners() {
    return [[this, 'click', this.#onClick]]
  }

  #onClick(event) {
    if ((!event.target) instanceof HTMLButtonElement) return

    if (this.dataset.status === 'uploading') {
      this.dispatchEvent(new Event('cancel', { bubbles: true }))
    }
  }
}

window.customElements.define('upload-actions', UploadActions)
