import nunjucks from 'nunjucks/browser/nunjucks-slim.js'
import path from 'path'
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
  #template

  constructor(template) {
    super()

    this.#template = template
  }

  connectedCallback() {
    this.#connected = true

    this.mounted()
  }

  disconnectedCallback() {
    this.#connected = false

    this.dismounted()
  }

  attributeChangedCallback() {
    if (!this.#connected) return

    this.render(this.dataset)
  }

  /* --- Methods for optional override --- */

  mounted() {
    // setup, such as adding listeners to the component
  }

  dismounted() {
    // clean up, such as removing listeners from the component
  }

  render(props) {
    this.innerHTML = nunjucksEnvironment.render(this.#template, {
      params: props
    })
  }
}
