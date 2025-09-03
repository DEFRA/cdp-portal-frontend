/**
 * @typedef {object} Options
 * @property {string|null} [classes=null]
 * @property {string|null} [text=null]
 * @property {boolean} [newTab=true]
 * @returns {string}
 */
function buildLink({ href, classes, text = null, newTab = true }) {
  const target = newTab ? 'target="_blank" rel="noopener noreferrer"' : ''
  const linkClasses = ['app-link']
  if (classes) {
    linkClasses.push(...classes.split(' '))
  }

  return `<a class="${linkClasses.join(' ')}"
             href="${href}"
             ${target}
             data-testid="app-link" >${text ?? href}</a>`
}

export { buildLink }
