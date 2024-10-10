import { escapeHtml } from '@hapi/hoek'
import { docsMarked } from '~/src/server/documentation/helpers/docs-marked'

const getHtml = (markdown) => docsMarked(markdown)

async function getTableOfContentsHTML(markdown) {
  const headingElements = []

  const renderer = {
    heading({ text, depth: level }) {
      const internalAnchorId = text.toLowerCase().replace(/\W+/g, '-')

      headingElements.push({
        anchor: internalAnchorId,
        level,
        text: escapeHtml(text)
      })

      return `<h${level} id="${internalAnchorId}" class="heading">
                ${text}
              </h${level}>`
    }
  }

  docsMarked.use({ renderer })
  await getHtml(markdown)

  return buildTableOfContents(headingElements)
}

function buildTableOfContents(elements) {
  let html = ''
  let level = 0

  for (const element of elements) {
    while (element.level > level) {
      html += '<ul class="govuk-list govuk-list--bullet">'
      level++
    }
    while (element.level < level) {
      html += '</ul>'
      level--
    }

    html += `<li><a class="app-link" href="#${element.anchor}">${element.text}</a></li>`
  }

  // Close any open lists
  while (level > 0) {
    html += '</ul>'
    level--
  }

  return html
}

function buildDocsNav(elements, path) {
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

    if (path.endsWith(element.anchor)) {
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

export { getHtml, getTableOfContentsHTML, buildDocsNav }
