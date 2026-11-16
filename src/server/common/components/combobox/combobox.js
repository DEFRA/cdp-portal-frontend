import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'
import template from './template.njk'

export default class ComboBox extends NunjucksComponent {
  constructor() {
    super(template)
  }
}

window.customElements.define('app-combobox', ComboBox)
