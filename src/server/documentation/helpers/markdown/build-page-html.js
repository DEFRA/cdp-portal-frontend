import { Marked } from 'marked'
import markedAlert from 'marked-alert'
import { stripHtml } from 'string-strip-html'
import { escapeRegex } from '@hapi/hoek'

import { linkExtension } from '../extensions/link.js'
import { headingExtension } from '../extensions/heading.js'

function createHighlightExtension(searchTerm) {
  if (!searchTerm) {
    return {
      name: 'highlight'
    }
  }

  const regex = new RegExp(`\\b${escapeRegex(searchTerm)}\\b`, 'i')

  return {
    name: 'highlight',
    level: 'inline',
    start(src) {
      return src.search(regex)
    },
    tokenizer(src) {
      // Skip matching inside auto-links, links, code, or already parsed tokens
      const match = regex.exec(src)
      if (
        match &&
        !/^(https?:\/\/|<http|\[|`)/.test(src) &&
        match?.index === 0
      ) {
        return {
          type: 'highlight',
          raw: match[0],
          text: match[0],
          tokens: []
        }
      }

      return null
    },
    renderer(token) {
      return `<mark class="app-mark">${token.text}</mark>`
    }
  }
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

async function buildPageHtml(request, markdown) {
  const searchTerm = request.query?.q
  const headingElements = []
  const docsMarked = new Marked({
    gfm: true,
    extensions: [linkExtension, headingExtension]
  }).use(markedAlert())

  const walkTokens = (token) => {
    if (token.type === 'heading') {
      const { text, depth: level } = token
      const cleanText = stripHtml(text).result
      const internalAnchorId = cleanText.toLowerCase().replace(/\W+/g, '-')
      const parsedText = docsMarked.parseInline(text)

      headingElements.push({
        anchor: internalAnchorId,
        level,
        text: parsedText
      })
    }
  }

  const highlightExtension = createHighlightExtension(searchTerm)
  docsMarked.use({
    walkTokens,
    extensions: [highlightExtension]
  })
  const html = await docsMarked.parse(markdown)

  return { html, toc: buildTableOfContents(headingElements) }
}

export { buildPageHtml }
