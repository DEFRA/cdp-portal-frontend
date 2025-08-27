import startCase from 'lodash/startCase.js'

import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'
import { buildSearchIndex } from './search-index.js'
import { docsBreadcrumbs } from './docs-breadcrumbs.js'
import { fetchMarkdown } from './s3-file-handler.js'
import { buildPageHtml } from './markdown/build-page-html.js'
import { buildDocsNav } from './markdown/build-docs-nav.js'

function buildPageTitle(documentationPath) {
  return documentationPath
    .replace('.md', '')
    .replace('README', '')
    .split('/')
    .map(startCase)
    .join(' - ')
}

async function markdownHandler(request, h, documentationPath, bucket) {
  const [markdown, nav] = await Promise.all([
    fetchMarkdown(request, bucket, documentationPath),
    buildDocsNav(request, bucket, documentationPath)
  ])
  const { html, toc } = await buildPageHtml(request, markdown)
  const pageTitle = buildPageTitle(documentationPath)

  // Prime search index async on docs page load
  buildSearchIndex(request, bucket).catch((error) =>
    request.logger.error(error)
  )

  return h
    .view('documentation/views/documentation', {
      pageTitle: `Documentation - ${pageTitle || 'Home'}`,
      content: html,
      breadcrumbs: docsBreadcrumbs(documentationPath),
      documentationPath,
      toc,
      nav
    })
    .code(statusCodes.ok)
}

export { markdownHandler }
