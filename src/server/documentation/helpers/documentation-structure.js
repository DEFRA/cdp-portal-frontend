import path from 'node:path'
import { Marked } from 'marked'
import { startCase } from 'lodash'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

import { fetchS3File } from '~/src/server/documentation/helpers/s3-file-handler'

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

/**
 * @typedef {Record<string, Array[string]>} Structure
 */

/**
 * Sort the structure object based on the order array
 * @param {Structure} structure
 * @param {Array<string>} order
 * @returns {object}
 */
function sortStructure(structure, order) {
  return Object.keys(structure)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .reduce((obj, key) => ({ ...obj, [key]: structure[key] }), {})
}

/**
 * Sort the docs links based on the order of internal links in a folders README.md file
 * @param {object} links
 * @param {Structure} structure
 * @returns {Array}
 */
function sortDocsLinks(links, structure) {
  const sorted = []

  // Top level link
  sorted.push(links.find((link) => link.level === 0))

  // Sort links
  for (const [folderName, folderFiles] of Object.entries(structure)) {
    const sectionFiles = links
      .filter((link) => link.anchor.includes(`/${folderName}/`))
      .sort((a, b) => {
        const aIndex = folderFiles.indexOf(a.anchor.split('/').at(-1))
        const bIndex = folderFiles.indexOf(b.anchor.split('/').at(-1))
        return aIndex - bIndex
      })

    if (sectionFiles.length > 0) {
      sorted.push(sectionFiles)
    }
  }

  return sorted.flat()
}

/**
 * Get ordered links that reflect the structure of the documentation repository
 * @param {Request} request
 * @param {string} bucket
 * @returns {Promise<Array>}
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
  const docsStructure = {}
  const rootFolderOrder = []

  /**
   * @typedef {{level: number, anchor: string, text: string}} File
   * @type {Promise<File>[]}
   */
  const docsStructurePromises = listObjectsResponse.Contents.filter((content) =>
    content.Key.endsWith('.md')
  ).map(async (content) => {
    const key = content.Key

    // Top level repository README.md
    if (key.toLowerCase() === 'readme.md') {
      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()

      rootFolderOrder.push(...(await getPageInternalLinksOrder(mdFile)))

      return {
        text: 'Documentation',
        anchor: path.join(docsRoute, key),
        level: 0
      }
    }

    // Folder README.md
    if (key.toLowerCase().endsWith('readme.md')) {
      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()
      const fileOrder = await getPageInternalLinksOrder(mdFile)
      const folderName = key.split('/').at(0)

      docsStructure[folderName] = fileOrder

      const text = key.replace(/\/readme.md/i, '')

      return {
        text: startCase(text),
        anchor: path.join(docsRoute, key),
        level: text.split('/').length
      }
    }

    // Folder .md files
    const textParts = key.split('/')
    textParts.shift()

    return {
      text: startCase(textParts.join(' ').replace('.md', '')),
      anchor: path.join(docsRoute, key),
      level: key.split('/').length
    }
  })

  const links = await Promise.all(docsStructurePromises)

  return sortDocsLinks(links, sortStructure(docsStructure, rootFolderOrder))
}

export { documentationStructure }
/**
 * @import {Request} from '@hapi/hapi'
 */
