import path from 'node:path'
import { Marked } from 'marked'
import startCase from 'lodash/startCase.js'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

import { fetchS3File } from './s3-file-handler.js'

/**
 * @typedef {{ name: string, contents: string[] }} Folder
 * @typedef {{ name: string  }} Page
 */

/**
 * Get the order of a README.md pages internal links
 * @param {string} markdown
 * @returns {Promise<[]>}
 */
async function getPageInternalLinksOrder(markdown) {
  const internalLinksOrder = []

  const walkTokens = (token) => {
    if (token.type === 'link' && token.href) {
      const isInternalFolderLink = /^\w.*\.md$/.test(token.href)

      if (isInternalFolderLink) {
        internalLinksOrder.push(token.href.split('/').at(0))
      }
    }
  }

  await new Marked().use({ walkTokens }).parse(markdown)

  return [...new Set(internalLinksOrder)]
}

/** @typedef {{ text: string, href: string, level: number }} Link */

/**
 * @typedef {object} Options
 * @property {string} name - list object key
 * @property {string} content - folder or page key
 * @property {string} docsRoute - documentation root route
 * @property {Folder[]} folders
 * @property {Page[]} pages
 */

/**
 * Build the structure of the documentation repository as link objects
 * @param {Options} options
 * @returns  Link[] | Link[][] | undefined
 */
function buildLinkStructure({ name, content, docsRoute, folders, pages }) {
  if (!content.endsWith('.md')) {
    // Folder
    const parentFolder = name.replace(/\/?README.md/, '')
    const folderKey = `${parentFolder ? parentFolder + '/' : ''}${content}/README.md`
    const folder = folders.find((f) => f.name === folderKey)

    if (folder) {
      const folderName = folder.name.replace('/README.md', '').split('/').at(-1)
      const level = folder.name.split('/').length - 1

      return [
        {
          text: startCase(folderName),
          href: path.join(docsRoute, folder.name),
          level
        },
        ...folder.contents.map((folderContent) =>
          buildLinkStructure({
            name: folder.name,
            content: folderContent,
            docsRoute,
            folders,
            pages
          })
        )
      ]
    }
  }

  if (content.endsWith('.md')) {
    // Page
    const parentFolder = name.replace(/\/?README.md/, '')
    const pageKey = `${parentFolder ? parentFolder + '/' : ''}${content}`
    const page = pages.find((p) => p.name === pageKey)

    if (page) {
      const pageName = startCase(page.name.split('/').at(-1).replace('.md', ''))
      const level = page?.name?.split('/').length

      return {
        text: pageName,
        href: path.join(docsRoute, page.name),
        level
      }
    }
  }
}

/**
 * Get ordered links that reflect the structure of the documentation repository
 * @param {import('@hapi/hapi').Request} request
 * @param {string} bucket
 * @returns {Promise<[]>}
 */
async function documentationStructure(request, bucket) {
  const command = new ListObjectsV2Command({
    Bucket: bucket
  })
  const listObjectsResponse = await request.s3Client.send(command)

  if (listObjectsResponse.Contents.length === 0) {
    return []
  }

  const docsRoute = '/documentation'

  const mdFiles = listObjectsResponse.Contents.filter((content) =>
    content.Key.endsWith('.md')
  )

  /**
   * Build Directory structure promises
   * @type {Promise<Folder | Page>[]}
   */
  const dirStructurePromises = mdFiles.map(async (content) => {
    const key = content.Key

    // Top level repository README.md
    if (key.toLowerCase() === 'readme.md') {
      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()
      const contents = await getPageInternalLinksOrder(mdFile)

      return {
        name: key,
        contents
      }
    }

    // Folder README.md
    if (key.toLowerCase().endsWith('readme.md')) {
      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()
      const contents = await getPageInternalLinksOrder(mdFile)

      return {
        name: key,
        contents
      }
    }

    // .md file
    return {
      name: key
    }
  })

  const dirStructure = await Promise.all(dirStructurePromises)
  const folders = dirStructure.filter((content) =>
    content.name.endsWith('README.md')
  )
  const pages = dirStructure.filter(
    (content) =>
      !content.name.endsWith('README.md') && content.name !== 'CONTRIBUTING.md'
  )
  const root = dirStructure.find((content) => content.name === 'README.md')

  return [
    {
      text: 'CDP',
      href: path.join(docsRoute, 'README.md'),
      level: 0
    },
    ...root.contents.map((content) =>
      buildLinkStructure({
        name: root.name,
        content,
        docsRoute,
        folders,
        pages
      })
    )
  ]
    .flat(2)
    .filter(Boolean)
}

export { documentationStructure }
