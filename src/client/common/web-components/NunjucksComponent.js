import nunjucks from 'nunjucks/browser/nunjucks-slim.js'
import path from 'path'

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
  }

  attributeChangedCallback() {
    if (!this.#connected) return

    this.innerHTML = this.render(this.dataset)
  }

  render(props) {
    return nunjucks.render(this.#template, { params: props })
  }
}
