import { Marked } from 'marked'
import markedAlert from 'marked-alert'
import { escapeHtml } from '@hapi/hoek'

import {
  linkExtension,
  headingExtension
} from '~/src/server/documentation/helpers/extensions'

const docsMarked = new Marked({
  pedantic: false,
  gfm: true,
  extensions: [linkExtension, headingExtension]
}).use(markedAlert())

async function getHtml(markdown) {
  const headingElements = []

  const walkTokens = (token) => {
    if (token.type === 'heading') {
      const { text, depth: level } = token
      const internalAnchorId = text.toLowerCase().replace(/\W+/g, '-')

      headingElements.push({
        anchor: internalAnchorId,
        level,
        text: escapeHtml(text)
      })
    }
  }

  docsMarked.use({ walkTokens })
  const html = await docsMarked.parse(markdown)

  return { html, toc: buildTableOfContents(headingElements) }
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

export { getHtml, buildDocsNav }
