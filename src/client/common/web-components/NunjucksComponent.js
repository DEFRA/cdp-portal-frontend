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

    this.managedListeners?.forEach(([target, event, handler]) => {
      const boundHandler = handler.bind(this)
      target.addEventListener(event, boundHandler)
      this.#boundListeners.push([target, event, boundHandler])
    })

    this.mounted()
  }

  disconnectedCallback() {
    this.#connected = false

    this.#boundListeners.forEach(([target, event, boundHandler]) => {
      target.removeEventListener(event, boundHandler)
    })
    this.#boundListeners = []

    this.dismounted()
  }

  attributeChangedCallback() {
    if (!this.#connected) return

    this.render()
  }

  // Renders a template update using a DOM morph https://github.com/bigskysoftware/idiomorph on the existing DOM
  morph(template, params, idiomorphOptions = {}) {
    const html = nunjucksEnvironment.render(template, {
      params
    })
    Idiomorph.morph(this, html, {
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

  render() {
    // Default render from `data-` attributes
    this.morph(this.#template, this.dataset)
  }
}
