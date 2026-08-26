import template from './template.js'
// import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

export default class Progress extends NunjucksComponent {
  static get observedAttributes() {
    return ['data-progress', 'data-complete', 'data-total']
  }

  constructor() {
    super(template)
  }
}

window.customElements.define('app-progress', Progress)
