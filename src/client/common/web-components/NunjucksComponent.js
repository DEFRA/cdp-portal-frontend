import { Idiomorph } from 'idiomorph'
import { nunjucksEnvironment } from '#config/nunjucks/client.js'

export default class NunjucksComponent extends HTMLElement {
  #connected = false
  #boundListeners = []
  #template

  constructor(template) {
    super()

    this.#template = template
  }

  connectedCallback() {
    this.#connected = true

    this.mounted()

    this.managedListeners?.forEach(([target, event, handler]) => {
      const boundHandler = handler.bind(this)
      target.addEventListener(event, boundHandler)
      this.#boundListeners.push([target, event, boundHandler])
    })
  }

  disconnectedCallback() {
    this.#connected = false

    this.#boundListeners.forEach(([target, event, boundHandler]) => {
      target.removeEventListener(event, boundHandler)
    })
    this.#boundListeners = []

    this.dismounted()
  }

  async attributeChangedCallback() {
    if (!this.#connected) return

    await this.render()
  }

  // Renders a template update using a DOM morph https://github.com/bigskysoftware/idiomorph on the existing DOM
  async morph(template, params, idiomorphOptions = {}) {
    const html = nunjucksEnvironment.render(template, {
      params
    })
    return Idiomorph.morph(this, html, {
      ...idiomorphOptions,
      morphStyle: 'innerHTML'
    })
  }

  /* --- Properties for optional override --- */

  get managedListeners() {
    return []
  }

  /* --- Methods for optional override --- */

  mounted() {
    // setup, such as adding listeners, fetching data
    // NOTE: Listeners can be auto setup using `managedListeners`
  }

  dismounted() {
    // clean up, such as removing listeners
    // NOTE: Listeners can be auto cleaned up using `managedListeners`
  }

  async render() {
    // Default render from `data-` attributes
    await this.morph(this.#template, this.dataset)

    // Allow htmx to work with rendered DOM
    window.htmx?.process(this)
  }
}
