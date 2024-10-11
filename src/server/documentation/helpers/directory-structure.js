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
      const isInternal = /^\w.*\.md$/.test(token.href)

      if (isInternal) {
        internalLinksOrder.push(token.href.split('/').at(0))
      }
    }
  }

  const marked = new Marked().use({ walkTokens })
  await marked.parse(markdown)

  return [...new Set(internalLinksOrder)]
}

/**
 *
 * @param {object} files
 * @param {Array[string]} sectionOrder
 * @param {Record<string, Array[string]>} sections
 * @returns {Array}
 */
function sortFileStructure(files, sectionOrder, sections) {
  const sorted = []

  // Top level link
  sorted.push(files.find((obj) => obj.level === 0))

  // Sort sections
  for (const sectionName of sectionOrder) {
    const sectionFiles = files
      .filter((link) => link.anchor.includes(`/${sectionName}/`))
      .sort((a, b) => {
        const aIndex = sections[sectionName].indexOf(a.anchor.split('/').at(-1))
        const bIndex = sections[sectionName].indexOf(b.anchor.split('/').at(-1))
        return aIndex - bIndex
      })

    if (sectionFiles.length > 0) {
      sorted.push(sectionFiles)
    }
  }

  return sorted.flat()
}

async function directoryStructure(request, bucket) {
  const command = new ListObjectsV2Command({
    Bucket: bucket
  })
  const listObjectsResponse = await request.s3Client.send(command)

  if (listObjectsResponse.Contents.length === 0) {
    return []
  }

  const docsRoute = '/documentation'
  const sections = {}
  let sectionOrder

  /**
   * @typedef {{level: number, anchor: string, text: string}} File
   * @type {Promise<File>[]}
   */
  const filePromises = listObjectsResponse.Contents.filter((content) =>
    content.Key.endsWith('.md')
  ).map(async (content) => {
    const key = content.Key

    // Top level README.md
    if (key.toLowerCase() === 'readme.md') {
      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()

      sectionOrder = await getPageInternalLinksOrder(mdFile)

      return {
        text: 'Documentation',
        anchor: path.join(docsRoute, key),
        level: 0
      }
    }

    // Section README.md
    if (key.toLowerCase().endsWith('readme.md')) {
      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()
      const fileOrder = await getPageInternalLinksOrder(mdFile)
      const sectionName = key.split('/').at(0)

      sections[sectionName] = fileOrder

      const text = key.replace(/\/readme.md/i, '')

      return {
        text: startCase(text),
        anchor: path.join(docsRoute, key),
        level: text.split('/').length
      }
    }

    // Section .md files
    const textParts = key.split('/')
    textParts.shift()

    return {
      text: startCase(textParts.join(' ').replace('.md', '')),
      anchor: path.join(docsRoute, key),
      level: key.split('/').length
    }
  })

  const files = await Promise.all(filePromises)

  return sortFileStructure(files, sectionOrder, sections)
}

export { directoryStructure }
