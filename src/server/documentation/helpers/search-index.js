import lunr from 'lunr'
import removeMarkdown from 'remove-markdown'
import { performance } from 'node:perf_hooks'
import { isAfter } from 'date-fns'

import {
  fetchS3File,
  fetchHeadObject,
  fetchListObjects
} from '~/src/server/documentation/helpers/s3-file-handler.js'

const store = {}

async function buildSearchIndex(request, bucket) {
  const docsMetaData = await fetchHeadObject(
    request,
    'docs-metadata.json',
    bucket
  )

  if (
    !store.lastModified ||
    isAfter(docsMetaData.LastModified, store.lastModified)
  ) {
    request.logger.debug('Fetching docs from S3 due to new data')

    const listObjectsResponse = await fetchListObjects(request, bucket)

    if (listObjectsResponse.Contents.length === 0) {
      return []
    }

    const mdFiles = listObjectsResponse.Contents.filter((content) =>
      content.Key.endsWith('.md')
    )

    const markdownPromises = mdFiles.map(async (content) => {
      const key = content.Key

      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()

      return {
        name: key,
        mdFile
      }
    })

    const markdownFiles = await Promise.all(markdownPromises)

    store.mdFiles = markdownFiles
    store.index = lunr(function () {
      this.ref('name')
      this.field('mdFile')
      this.metadataWhitelist = ['position'] // https://github.com/olivernn/moonwalkers/blob/6d5a6e976921490033681617e92ea42e3a80eed0/build-index#L23-L29

      for (const markDownFile of markdownFiles) {
        this.add(markDownFile)
      }
    })
    store.lastModified = docsMetaData.LastModified
  } else {
    request.logger.debug('Using stored in-memory search index')
  }

  return store
}

/**
 * Remove markdown, new lines, multiple spaces, GitHub markdown extensions, first and last word and trim
 * @param textWithContext
 * @param searchTerm
 * @returns {string|null}
 */
function clean(textWithContext, searchTerm) {
  if (!textWithContext) {
    return null
  }

  const clean = removeMarkdown(textWithContext)
  const lines = clean.replace(/\[!.*]/g, '').split('\n')
  const lineWithSearchTerm = lines.find((line) => {
    const regex = new RegExp(searchTerm, 'i')
    return regex.test(line)
  })

  if (lineWithSearchTerm) {
    const words = lineWithSearchTerm.replace(/\s\s+/g, ' ').split(' ')

    if (words.length > 4) {
      return words.slice(1, -1).join(' ')
    }

    return words.join(' ')
  }

  return null
}

async function searchIndex(request, bucket, query) {
  const startBuildIndex = performance.now()

  const searchIndex = await buildSearchIndex(request, bucket)

  // Remove some special characters
  const cleanedQuery = query?.replace(/[\^:~+-]/g, '') ?? null
  const results = cleanedQuery ? searchIndex.index.search(cleanedQuery) : []

  const searchSuggestions = results
    .flatMap((result) => {
      const markdownFile = searchIndex.mdFiles.find(
        (file) => file.name === result.ref
      )

      if (markdownFile) {
        const positions = Object.keys(result.matchData.metadata).flatMap(
          (text) =>
            Object.keys(result.matchData.metadata[text]).map((fieldName) => {
              const [startPos, length] =
                result.matchData.metadata[text][fieldName].position.at(0)

              const searchTerm = markdownFile.mdFile.slice(
                startPos,
                startPos + length
              )

              const surroundingCharacters = 20
              const slice = markdownFile.mdFile.slice(
                startPos - surroundingCharacters,
                startPos + length + surroundingCharacters
              )

              const cleanMarkdown = clean(slice, query)
              const searchTermWithContext = cleanMarkdown ?? searchTerm

              return {
                value: result.ref,
                text: searchTermWithContext
              }
            })
        )

        return positions
      }

      return null
    })
    .filter(Boolean)

  const endBuildIndex = performance.now()
  request.logger.debug(
    `Search index build took ${endBuildIndex - startBuildIndex} milliseconds`
  )

  return searchSuggestions
}

export { searchIndex }
