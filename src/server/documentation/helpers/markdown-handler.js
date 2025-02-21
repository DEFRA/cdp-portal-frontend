import startCase from 'lodash/startCase.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'

import { statusCodes } from '~/src/server/common/constants/status-codes.js'
import { buildSearchIndex } from '~/src/server/documentation/helpers/search-index.js'
import { docsBreadcrumbs } from '~/src/server/documentation/helpers/docs-breadcrumbs.js'
import { buildDocsNav } from '~/src/server/documentation/helpers/markdown/build-docs-nav.js'
import { buildPageHtml } from '~/src/server/documentation/helpers/markdown/build-page-html.js'

async function fetchMarkdown(request, documentationPath, bucket) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: documentationPath
  })
  const response = await request.s3Client.send(command)

  return response.Body.transformToString()
}

function buildPageTitle(documentationPath) {
  return documentationPath
    .replace('.md', '')
    .replace('README', '')
    .split('/')
    .map(startCase)
    .join(' - ')
}

async function markdownHandler(request, h, documentationPath, bucket) {
  const markdown = await fetchMarkdown(request, documentationPath, bucket)
  const { html, toc } = await buildPageHtml(request.query?.q, markdown)
  const nav = await buildDocsNav(request, bucket)
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
      toc,
      nav
    })
    .code(statusCodes.ok)
}

export { markdownHandler }
