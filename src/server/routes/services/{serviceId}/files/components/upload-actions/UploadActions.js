import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

export default class UploadActions extends NunjucksComponent {
  static get observedAttributes() {
    return ['data-status']
  }

  constructor() {
    super(template)
  }
}

window.customElements.define('upload-actions', UploadActions)
