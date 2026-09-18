import nunjucks from 'nunjucks/browser/nunjucks-slim.js'
import path from 'path'
import { Idiomorph } from 'idiomorph'
import * as filters from '#config/nunjucks/filters/filters.js'

const nunjucksEnvironment = nunjucks.configure()
nunjucksEnvironment.addGlobal('govukRebrand', true)

for (const filter of Object.keys(filters)) {
  nunjucksEnvironment.addFilter(filter, filters[filter])
}

/*
 * Patch loader due to missing `path` reference
 */
nunjucks.PrecompiledLoader.prototype.resolve = function patchedResolve(
  from,
  to
) {
  const result = path.resolve(path.dirname(from), to)
  return result.startsWith('/') ? result.replace('/', '') : result
}

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

    this.render(this.dataset)
  }

  /* --- Properties for optional override --- */

  get managedListeners() {
    return []
  }

  /* --- Methods for optional override --- */

  mounted() {
    // setup, such as adding listeners
    // NOTE: DOM listeners can be auto setup using `managedListeners`
  }

  dismounted() {
    // clean up, such as removing listeners
    // NOTE: DOM listeners can be auto cleaned up using `managedListeners`
  }

  // Renders an update using a DOM morph https://github.com/bigskysoftware/idiomorph on the existing DOM
  render(props, idiomorphOptions = {}) {
    const html = nunjucksEnvironment.render(this.#template, {
      params: props
    })
    Idiomorph.morph(this, html, {
      ...idiomorphOptions,
      morphStyle: 'innerHTML'
    })
  }
}
