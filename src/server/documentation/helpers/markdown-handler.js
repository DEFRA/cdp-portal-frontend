import { startCase } from 'lodash'
import { GetObjectCommand } from '@aws-sdk/client-s3'

import { directoryStructure } from '~/src/server/documentation/helpers/directory-structure'
import { docsBreadcrumbs } from '~/src/server/documentation/helpers/docs-breadcrumbs'
import { statusCodes } from '~/src/server/common/constants/status-codes'
import {
  buildDocsNav,
  getHtml
} from '~/src/server/documentation/helpers/markdown'

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
  const { html, toc } = await getHtml(markdown)
  const directoryListings = await directoryStructure(request, bucket)
  const nav = buildDocsNav(directoryListings, request.path)
  const pageTitle = buildPageTitle(documentationPath)

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
