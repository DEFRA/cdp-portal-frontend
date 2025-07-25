import lunr from 'lunr'
import { Marked } from 'marked'
import { isAfter } from 'date-fns'
import { stripHtml } from 'string-strip-html'
import { performance } from 'node:perf_hooks'
import markedPlaintify from 'marked-plaintify'
import { escapeRegex } from '@hapi/hoek'

import { excludedMarkdownFiles } from '../constants/excluded-markdown-files.js'
import {
  fetchS3File,
  fetchHeadObject,
  fetchListObjects
} from './s3-file-handler.js'

const store = {}
const convertToPlainTextMarked = new Marked({ gfm: true }).use(
  markedPlaintify()
)

async function buildSearchIndex(request, bucket) {
  const startBuildIndex = performance.now()

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

    const mdFiles = listObjectsResponse.Contents.filter(
      (content) =>
        content.Key.endsWith('.md') &&
        !excludedMarkdownFiles.includes(content.Key)
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

  const endBuildIndex = performance.now()
  request.logger.debug(
    `Search index build took ${endBuildIndex - startBuildIndex} milliseconds`
  )

  return store
}

/**
 * Remove broken words from the beginning and end of a line if they do not match the searchTerm
 * @param {string} text
 * @param {string} searchTerm
 * @returns {string}
 */
function removeBrokenWords(text, searchTerm) {
  const lowerSearchTerm = searchTerm.toLowerCase()
  let line = text

  if (line.toLowerCase() === lowerSearchTerm) {
    return line
  }

  const firstWord = line.substr(0, line.indexOf(' ')).toLowerCase()
  const lastWord = line.split(' ').splice(-1)[0].toLowerCase()

  if (
    !line.toLowerCase().startsWith(lowerSearchTerm) &&
    !firstWord.includes(lowerSearchTerm)
  ) {
    line = line.replace(/^\S+\s/, '')
  }

  if (
    !line.toLowerCase().endsWith(lowerSearchTerm) &&
    !lastWord.includes(lowerSearchTerm)
  ) {
    line = line.replace(/\s\S+$/, '')
  }

  return line
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

  const regex = new RegExp(escapeRegex(searchTerm), 'ig')
  const lineWithSearchTerm = textWithContext
    .split('\n')
    .find((line) => regex.test(line))

  if (lineWithSearchTerm) {
    return removeBrokenWords(lineWithSearchTerm, searchTerm)
  }

  return null
}

/**
 * Provide suggestions unique by value and text
 * @param {Array} unique
 * @param {{text: string, value: string}} suggestion
 * @returns {Array}
 */
function makeUnique(unique, suggestion) {
  if (
    !unique.some(
      (obj) => obj.value === suggestion.value && obj.text === suggestion.text
    )
  ) {
    unique.push(suggestion)
  }
  return unique
}

async function searchIndex(request, bucket, query) {
  const startPrepareResults = performance.now()

  const builtSearchIndex = await buildSearchIndex(request, bucket)

  if (!builtSearchIndex.index || !builtSearchIndex.files) {
    return []
  }

  // Remove some lunr special characters
  const queryTerm = query?.replace(/[*^:~+-]/g, '') ?? null
  const results = queryTerm
    ? builtSearchIndex.index.search(
        `${queryTerm}^100 ${queryTerm}*^50 *${queryTerm}^25 ${queryTerm}~4`
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
                const sliceStart = Math.max(startPos - surroundingCharacters, 0)
                const sliceEnd = startPos + length + surroundingCharacters
                const slice = match.file.slice(sliceStart, sliceEnd)
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

  const endPrepareResults = performance.now()
  request.logger.debug(
    `Results prep took ${endPrepareResults - startPrepareResults} milliseconds`
  )

  return searchSuggestions
}

export { searchIndex, buildSearchIndex }
