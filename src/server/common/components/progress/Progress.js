import nunjucks from 'nunjucks/browser/nunjucks-slim.js'
import './template.js'

export default class Progress extends HTMLElement {
  #connected = false

  static get observedAttributes() {
    return ['data-progress', 'data-complete', 'data-total']
  }

  connectedCallback() {
    this.#connected = true
  }

  attributeChangedCallback() {
    if (!this.#connected) return

    this.innerHTML = nunjucks.render('template.njk', { params: this.dataset })
  }
}

window.customElements.define('app-progress', Progress)
