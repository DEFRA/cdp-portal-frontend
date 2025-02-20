import lunr from 'lunr'
import { isAfter } from 'date-fns'
import removeMarkdown from 'remove-markdown'
import { performance } from 'node:perf_hooks'

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

    const fetchMarkdownPromises = mdFiles.map(async (content) => {
      const key = content.Key

      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()

      return {
        name: key,
        file: removeMarkdown(mdFile)
      }
    })

    const textFiles = await Promise.all(fetchMarkdownPromises)

    store.files = textFiles
    store.index = lunr(function () {
      this.ref('name')
      this.field('file')
      this.metadataWhitelist = ['position'] // https://github.com/olivernn/moonwalkers/blob/6d5a6e976921490033681617e92ea42e3a80eed0/build-index#L23-L29

      for (const file of store.files) {
        this.add(file)
      }
    })
    store.lastModified = docsMetaData.LastModified
  } else {
    request.logger.debug('Using stored in-memory search index')
  }

  return store
}

/**
 * @param {string|null} textWithContext
 * @param {string} searchTerm
 * @returns {string|null}
 */
function prepTextResult(textWithContext, searchTerm) {
  if (!textWithContext) {
    return null
  }

  const lines = textWithContext.split('\n')
  const regex = new RegExp(searchTerm, 'i')
  const lineWithSearchTerm = lines.find((line) => regex.test(line))

  if (lineWithSearchTerm) {
    const words = lineWithSearchTerm.replace(/\s\s+/g, ' ').split(' ')

    if (words.length > 4) {
      // remove start and end words that do not match searchTerm, as its likely they are not full words and won't
      // make sense in the results
      return words
        .map((word, i, array) => {
          if (i === 0 || i === array.length - 1) {
            return regex.test(word) ? word : null
          }

          return word
        })
        .filter(Boolean)
        .join(' ')
    }

    return words.join(' ')
  }

  return null
}

async function searchIndex(request, bucket, query) {
  const startBuildIndex = performance.now()

  const searchIndex = await buildSearchIndex(request, bucket)

  // Remove some lunr special characters
  const queryTerm = query?.replace(/[*^:~+-]/g, '') ?? null
  const results = queryTerm
    ? searchIndex.index.search(
        `${queryTerm}^100 ${queryTerm}*^10 ${queryTerm}~2` // https://github.com/olivernn/lunr.js/issues/256#issuecomment-295407852
      )
    : []

  const searchSuggestions = results
    .flatMap((result) => {
      const match = searchIndex.files.find((file) => file.name === result.ref)

      if (match) {
        const positions = Object.keys(result.matchData.metadata).flatMap(
          (text) =>
            Object.keys(result.matchData.metadata[text]).map((fieldName) => {
              const [startPos, length] =
                result.matchData.metadata[text][fieldName].position.at(0)

              const surroundingCharacters = 30
              const slice = match.file.slice(
                startPos - surroundingCharacters,
                startPos + length + surroundingCharacters
              )

              const textResult = prepTextResult(slice, query)

              if (!textResult) {
                return null
              }

              return {
                value: result.ref,
                text: textResult
              }
            })
        )

        return positions.filter(Boolean)
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
