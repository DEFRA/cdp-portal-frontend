import { directoryStructure } from '~/src/server/documentation/helpers/directory-structure'

async function buildDocsNav(request, bucket) {
  const elements = await directoryStructure(request, bucket)

  let html = ''
  let level = -1

  for (const element of elements) {
    while (element.level > level) {
      html += '<ul class="govuk-list govuk-list--bullet">'
      level++
    }
    while (element.level < level) {
      html += '</ul>'
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
  while (level > 0) {
    html += '</ul>'
    level--
  }

  return html
}

export { buildDocsNav }
