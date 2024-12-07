import { documentationStructure } from '~/src/server/documentation/helpers/documentation-structure.js'

/**
 * Build the docs links nav. Note for accessibility reasons, nested ul elements are wrapped in li elements.
 * @param {import('@hapi/hapi').Request} request
 * @param {string} bucket
 * @returns {Promise<string>}
 */
async function buildDocsNav(request, bucket) {
  const links = await documentationStructure(request, bucket)

  const rootLevel = 0
  let html = ''
  let level = -1

  for (const link of links) {
    while (link.level > level) {
      if (link.level > rootLevel) {
        html += '<li>'
      }

      html += '<ul class="govuk-list govuk-list--bullet">'
      level++
    }
    while (link.level < level) {
      html += '</ul>'

      if (link.level > rootLevel) {
        html += '</li>'
      }

      level--
    }

    const classes = ['app-link']

    if (request.path.endsWith(link.href)) {
      classes.push('is-active')
    }

    html += '<li>'
    html += `<a class="${classes.join(' ')}" href="${link.href}">${link.text}</a>`
    html += '</li>'
  }

  // Close any open lists
  while (level > rootLevel) {
    html += '</ul></li>'
    level--
  }

  return html
}

export { buildDocsNav }
