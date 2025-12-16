import startCase from 'lodash/startCase.js'
import { statusCodes } from '@defra/cdp-validation-kit'

import { buildArticleNav } from './markdown/build-blog-nav.js'
import { fetchMarkdown } from '../../documentation/helpers/s3-file-handler.js'
import {
  buildBlogPageHtml,
  extractTagsFromMarkdown
} from '../../documentation/helpers/markdown/build-page-html.js'

function buildPageTitle(articlePath) {
  const pathParts = articlePath.replace('.md', '').split('-')
  pathParts.shift()

  return pathParts.map(startCase).join(' ')
}

async function blogMarkdownHandler(request, h, articlePath, bucket) {
  const articleKey = `blog/${articlePath}`

  const [markdown, nav] = await Promise.all([
    fetchMarkdown(request, bucket, articleKey),
    buildArticleNav(request, bucket, articlePath)
  ])
  const tags = extractTagsFromMarkdown(markdown)
  const { html, toc } = await buildBlogPageHtml({ markdown, tags, articlePath })
  const pageTitle = buildPageTitle(articlePath)

  return h
    .view('home/views/blog', {
      pageTitle: `Blog - ${pageTitle}`,
      content: html,
      breadcrumbs: [{ text: 'Home', href: '/' }, { text: 'Blog' }],
      toc,
      nav,
      breadCrumbsClasses: 'app-breadcrumbs--inverse'
    })
    .code(statusCodes.ok)
}

export { blogMarkdownHandler }
