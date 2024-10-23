import { documentationStructure } from '~/src/server/documentation/helpers/documentation-structure'

/**
 * Build the docs links nav. Note for accessibility reasons, nested ul elements are wrapped in li elements.
 * @param {Request} request
 * @param {string} bucket
 * @returns {Promise<string>}
 */
async function buildDocsNav(request, bucket) {
  const elements = await documentationStructure(request, bucket)

  const rootLevel = 0
  let html = ''
  let level = -1

  for (const element of elements) {
    while (element.level > level) {
      if (element.level > rootLevel) {
        html += '<li>'
      }

      html += '<ul class="govuk-list govuk-list--bullet">'
      level++
    }
    while (element.level < level) {
      html += '</ul>'

      if (element.level > rootLevel) {
        html += '</li>'
      }

      level--
    }

    const classes = ['app-link']

    if (request.path.endsWith(element.anchor)) {
      classes.push('is-active')
    }

    html += '<li>'
    html += `<a class="${classes.join(' ')}" href="${element.anchor}">${element.text}</a>`
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
/**
 * @import { Request } from '@hapi/hapi'
 */
