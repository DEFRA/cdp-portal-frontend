import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

export default class UploadForm extends NunjucksComponent {
  static get observedAttributes() {
    return ['data-status']
  }

  render(props) {
    // override to prevent render
  }
}

window.customElements.define('upload-form', UploadForm)
