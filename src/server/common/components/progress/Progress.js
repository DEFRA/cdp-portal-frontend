import './template.js'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

export default class Progress extends NunjucksComponent {
  static get observedAttributes() {
    return ['data-progress', 'data-complete', 'data-total']
  }

  constructor() {
    super('template.njk')
  }
}

window.customElements.define('app-progress', Progress)
