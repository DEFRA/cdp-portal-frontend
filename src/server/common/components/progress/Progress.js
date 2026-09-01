import template from './template.njk'
import NunjucksComponent from '#client/common/web-components/NunjucksComponent.js'

export default class Progress extends NunjucksComponent {
  #progressIndicator
  #progressReadout

  static get observedAttributes() {
    return ['data-progress', 'data-complete', 'data-total']
  }

  mounted() {
    this.#progressIndicator = this.querySelector('.app-progress__indicator')
    this.#progressReadout = this.querySelector('.app-progress__readout')
  }

  render({ progress, complete, total }) {
    if (this.#progressIndicator) {
      this.#progressIndicator.style.width = `${progress}%`
    }

    if (this.#progressReadout) {
      this.#progressReadout.textContent = `${complete} / ${total}`
    }
  }
}

window.customElements.define('app-progress', Progress)
