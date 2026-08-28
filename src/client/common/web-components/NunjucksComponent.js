import nunjucks from 'nunjucks/browser/nunjucks-slim.js'
import path from 'path'
import { formatFileSize } from '#config/nunjucks/filters/filters.js'

const env = nunjucks.configure()
env.addFilter('formatFileSize', formatFileSize)

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

  // Protected methods for optional override

  mounted() {}

  dismounted() {}

  render(props) {
    this.innerHTML = env.render(this.#template, { params: props })
  }
}
