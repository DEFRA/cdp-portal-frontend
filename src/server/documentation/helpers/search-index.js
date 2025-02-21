import lunr from 'lunr'
import { Marked } from 'marked'
import { isAfter } from 'date-fns'
import { stripHtml } from 'string-strip-html'
import { performance } from 'node:perf_hooks'
import markedPlaintify from 'marked-plaintify'

import {
  fetchS3File,
  fetchHeadObject,
  fetchListObjects
} from '~/src/server/documentation/helpers/s3-file-handler.js'

const store = {}

const convertToPlainTextMarked = new Marked({ gfm: true }).use(
  markedPlaintify()
)

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
        file: stripHtml(convertToPlainTextMarked.parse(mdFile)).result
      }
    })

    store.files = await Promise.all(fetchMarkdownPromises)
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
 * Remove half words from the start and finish of the match, if they don't match the searchTerm
 * @param {string} searchTerm
 * @param {string} match
 * @returns {string}
 */
function removeTruncatedWordsFromBoundaries(searchTerm, match) {
  const line = match.replace(/\s\s+/g, ' ')

  const cleanedLine = line.toLowerCase().startsWith(searchTerm.toLowerCase())
    ? line
    : line.substring(line.indexOf(' '), line.length)

  return cleanedLine.substring(0, cleanedLine.lastIndexOf(' '))
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
    return removeTruncatedWordsFromBoundaries(searchTerm, lineWithSearchTerm)
  }

  return null
}

/**
 * Provide suggestions unique by value, which is the docs url
 * @param {Array} unique
 * @param {{text: string, value: string}} suggestion
 * @returns {Array}
 */
function makeUnique(unique, suggestion) {
  if (!unique.some((obj) => obj.value === suggestion.value)) {
    unique.push(suggestion)
  }
  return unique
}

async function searchIndex(request, bucket, query) {
  const startBuildIndex = performance.now()

  const builtSearchIndex = await buildSearchIndex(request, bucket)

  if (!builtSearchIndex.index || !builtSearchIndex.files) {
    return []
  }

  // Remove some lunr special characters
  const queryTerm = query?.replace(/[*^:~+-]/g, '') ?? null
  const results = queryTerm
    ? builtSearchIndex.index.search(
        `${queryTerm}^100 ${queryTerm}*^10 ${queryTerm}~2` // https://github.com/olivernn/lunr.js/issues/256#issuecomment-295407852
      )
    : []

  const searchSuggestions = results
    .flatMap((result) => {
      const match = builtSearchIndex.files.find(
        (file) => file.name === result.ref
      )

      if (match) {
        return Object.keys(result.matchData.metadata).flatMap((text) =>
          Object.keys(result.matchData.metadata[text]).flatMap((fieldName) =>
            result.matchData.metadata[text][fieldName].position
              .map((positionDetail) => {
                const [startPos, length] = positionDetail

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
              .filter(Boolean)
          )
        )
      }

      return null
    })
    .filter(Boolean)
    .reduce(makeUnique, [])

  const endBuildIndex = performance.now()
  request.logger.debug(
    `Search index build took ${endBuildIndex - startBuildIndex} milliseconds`
  )

  return searchSuggestions
}

export { searchIndex }
