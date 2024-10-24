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

function buildLinkStructure(docsRoute, section, folders, pages) {
  if (!section.endsWith('.md')) {
    const folder = folders.find(
      (folder) => folder.key.endsWith(`${section}/README.md`) // TODO tighten up for nested folders 2 deep
    )
    const folderName = folder.key.replace('/README.md', '').split('/').at(-1)
    const level = folder.key.split('/').length - 1

    return [
      {
        text: startCase(folderName),
        anchor: path.join(docsRoute, folder.key),
        level
      },
      ...folder.items.map((section) =>
        buildLinkStructure(docsRoute, section, folders, pages)
      )
    ]
  }

  if (section.endsWith('.md')) {
    const page = pages.find((page) => page.key.endsWith(section)) // TODO tighten up to exact match items
    const pageName = startCase(page.key.split('/').at(-1).replace('.md', ''))
    const level = page.key.split('/').length

    return {
      text: pageName,
      anchor: path.join(docsRoute, page.key),
      level
    }
  }
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

  const mdFiles = listObjectsResponse.Contents.filter((content) =>
    content.Key.endsWith('.md')
  )
  const structurePromises = mdFiles.map(async (content) => {
    const key = content.Key

    // Top level repository README.md
    if (key.toLowerCase() === 'readme.md') {
      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()
      const items = await getPageInternalLinksOrder(mdFile)

      return {
        key,
        items // TODO make items aware of parent folder
      }

      /*
      TODO this needs to be the folders so:

      items: items.map(item => ({folder: key.replace('README.md', ''), name: item}))

      // Note folder may be empty
      const folder = folders.find(
        (folder) => folder.key === `${section.folder}/${section.name}/README.md`)
      )

      const page = pages.find((page) => page.key === `${section.folder}/${section.name}`)
       */
    }

    // Folder README.md
    if (key.toLowerCase().endsWith('readme.md')) {
      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()
      const items = await getPageInternalLinksOrder(mdFile)

      return {
        key,
        items // TODO make items aware of parent folder
      }
    }

    // .md file
    return {
      key
    }
  })

  const structure = await Promise.all(structurePromises)
  const folders = structure.filter((item) => item.key.endsWith('README.md'))
  const pages = structure.filter(
    (item) => !item.key.endsWith('README.md') && item.key !== 'CONTRIBUTING.md'
  )
  const root = structure.find((item) => item.key === 'README.md')

  return [
    {
      text: 'Documentation',
      anchor: path.join(docsRoute, 'README.md'),
      level: 0
    },
    ...root.items.map((section) =>
      buildLinkStructure(docsRoute, section, folders, pages)
    )
  ].flat(2)
}

export { documentationStructure }
/**
 * @import {Request} from '@hapi/hapi'
 */
