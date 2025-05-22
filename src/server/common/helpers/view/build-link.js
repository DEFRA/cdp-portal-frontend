/**
 * @typedef {object} Options
 * @property {string|null} [text=null]
 * @property {boolean} [newTab=true]
 * @returns {string}
 */
function buildLink({ href, text = null, newTab = true }) {
  const target = newTab ? 'target="_blank" rel="noopener noreferrer"' : ''

  return `<a class="app-link"
             href="${href}"
             ${target}
             data-testid="app-link" >${text ?? href}</a>`
}

export { buildLink }
