import { Marked } from 'marked'
import markedAlert from 'marked-alert'

import { linkExtension } from '~/src/server/documentation/helpers/extensions/link.js'
import { headingExtension } from '~/src/server/documentation/helpers/extensions/heading.js'

const docsMarked = new Marked({
  pedantic: false,
  gfm: true,
  extensions: [linkExtension, headingExtension]
}).use(markedAlert())

async function buildPageHtml(markdown) {
  const headingElements = []

  const walkTokens = (token) => {
    if (token.type === 'heading') {
      const { text, depth: level } = token
      const internalAnchorId = text.toLowerCase().replace(/\W+/g, '-')
      const parsedText = docsMarked.parseInline(text)

      headingElements.push({
        anchor: internalAnchorId,
        level,
        text: parsedText
      })
    }
  }

  docsMarked.use({ walkTokens })
  const html = await docsMarked.parse(markdown)

  return { html, toc: buildTableOfContents(headingElements) }
}

function buildTableOfContents(links) {
  const rootLevel = 1
  let html = ''
  let level = 0

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

    html += `<li><a class="app-link" href="#${link.anchor}">${link.text}</a></li>`
  }

  // Close any open lists
  while (level > rootLevel) {
    html += '</ul></li>'
    level--
  }

  return html
}

export { buildPageHtml }