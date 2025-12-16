import { Marked } from 'marked'
import markedAlert from 'marked-alert'
import { stripHtml } from 'string-strip-html'
import { escapeRegex } from '@hapi/hoek'

import { linkExtension } from '../extensions/link.js'
import { headingExtension } from '../extensions/heading.js'
import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'
import { previewHeadingsExtension } from '../../../home/helpers/extensions/preview-headings.js'
import { codeExtension } from '../extensions/code.js'
import { renderTag } from '../../../common/helpers/view/render-tag.js'

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

/**
 * Provide the class for the tag component based on the tag text
 * @param {string} tagString
 * @returns {string}
 */
function generateTagClasses(tagString) {
  switch (true) {
    case /(bug|error|issue|fix|hotfix|action|required)/i.test(tagString):
      return 'govuk-tag--red'
    case /(enhancement|feature|improvement|update)/i.test(tagString):
      return 'govuk-tag--green'
    case /(release|version|release note)/i.test(tagString):
      return 'govuk-tag--light-blue'
    default:
      return 'govuk-tag--blue'
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

function renderArticleDate(articlePath) {
  const pathParts = articlePath.split('/').at(-1)
  const articleDate = pathParts.split('-').shift()

  return renderComponent('time', {
    classes: 'app-blog__date',
    datetime: articleDate,
    formatString: 'EEEE do MMMM yyyy',
    withoutTooltip: true
  })
}

function addHeadingInternalAnchors(token, marked, headings) {
  if (token.type === 'heading') {
    const { text, depth: level } = token
    const cleanText = stripHtml(text).result
    const internalAnchorId = cleanText.toLowerCase().replace(/\W+/g, '-')
    const parsedText = marked.parseInline(text)

    headings.push({
      anchor: internalAnchorId,
      level,
      text: parsedText
    })
  }
}

/**
 * HTML page for the documentation pages. Add heading anchors, build table of contents add highlight for search results
 * @param {Request} request
 * @param {string} markdown
 * @returns {Promise<{html: Promise<string> | string, toc: string}>}
 */
async function buildDocsPageHtml(request, markdown) {
  const searchTerm = request.query?.q
  const headings = []
  const docsMarked = new Marked({
    gfm: true,
    extensions: [linkExtension, headingExtension, codeExtension]
  }).use(markedAlert())

  docsMarked.use({
    walkTokens: (token) =>
      addHeadingInternalAnchors(token, docsMarked, headings),
    extensions: [createHighlightExtension(searchTerm)]
  })
  const html = await docsMarked.parse(markdown)

  return { html, toc: buildTableOfContents(headings) }
}

/**
 * HTML page for the blog pages. Add article datetime element, heading anchors and build table of contents
 * @param {string} markdown
 * @param {string}[] tags
 * @param {string} articlePath
 * @param {boolean} withBlogLink
 * @returns {Promise<{html: string, toc: string}>}
 */
async function buildBlogPageHtml({
  markdown,
  tags,
  articlePath,
  withBlogLink = false
}) {
  const previewHeadersExtension = previewHeadingsExtension(
    withBlogLink ? articlePath : null
  )
  const headings = []
  const extensions = [linkExtension, previewHeadersExtension, codeExtension]
  const blogMarked = new Marked({
    gfm: true,
    extensions
  }).use(markedAlert())

  blogMarked.use({
    walkTokens: (token) =>
      addHeadingInternalAnchors(token, blogMarked, headings)
  })

  const html = await blogMarked.parse(markdown)
  const articleDateTime = renderArticleDate(articlePath)
  const tagsMarkup = tags
    .map((tag) => renderTag({ text: tag, classes: generateTagClasses(tag) }))
    .join(' ')

  return {
    html: `${tagsMarkup}${articleDateTime}\n\n${html}`,
    toc: buildTableOfContents(headings)
  }
}

/**
 * Extract all hrefs from blog nav Markdown content. Used to order the articles and show the latest on the home page
 * @param {string} markdown
 * @returns {[{string}]}
 */
function extractHrefs(markdown) {
  const hrefs = []
  const blogMarked = new Marked({ gfm: true })

  const walkTokens = (token) => {
    if (token.type === 'link') {
      hrefs.push(token.href)
    }
  }

  blogMarked.use({ walkTokens })
  blogMarked.parse(markdown)

  return hrefs
}

/**
 * Extract tags from Markdown comments at the top of the file
 * @param {string} markdown
 * @returns {*|*[]}
 */
function extractTagsFromMarkdown(markdown) {
  const match = markdown.match(/<!--\s*Labels:([\w\s,]*)-->/)

  if (!match) {
    return []
  }

  return match[1]
    .trim()
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export {
  buildDocsPageHtml,
  buildBlogPageHtml,
  extractHrefs,
  extractTagsFromMarkdown
}

/**
 * @import {Request} from '@hapi/hapi'
 */
