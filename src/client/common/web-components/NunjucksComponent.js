import nunjucks from 'nunjucks/browser/nunjucks-slim.js'

export default class NunjucksComponent extends HTMLElement {
  #connected = false
  #template

  constructor(template) {
    super()

    this.#template = template
  }

  connectedCallback() {
    this.#connected = true
  }

  attributeChangedCallback() {
    if (!this.#connected) return

    this.innerHTML = this.render(this.dataset)
  }

  render(props) {
    return nunjucks.render(this.#template, { params: props })
  }
}
