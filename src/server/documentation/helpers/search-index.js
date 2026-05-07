import lunr from 'lunr'
import { isAfter } from 'date-fns'
import { performance } from 'node:perf_hooks'
import { Marked } from 'marked'
import markedPlaintify from 'marked-plaintify'

import { shouldExcludedItem } from './excluded-items.js'
import { headingToAnchor } from './extensions/heading-anchor.js'
import {
  fetchS3File,
  fetchHeadObject,
  fetchListObjects
} from './s3-file-handler.js'

const MAX_OCCURRENCES_PER_DOC = 5
const MAX_SNIPPET_LENGTH = 120

const store = {}

const HEADING_RE = /^#{1,6}\s/

const plaintext = new Marked({ gfm: true }).use(markedPlaintify())

async function stripMarkdown(text) {
  const plain = await plaintext.parse(text)
  return plain.replaceAll(/\s+/g, ' ').trim()
}

async function parseDocument(name, rawFile) {
  const lines = rawFile.split('\n')
  const headings = lines
    .filter((line) => HEADING_RE.test(line))
    .map((line) => line.replace(/^#+\s*/, ''))
    .join(' ')
  const body = await stripMarkdown(
    lines.filter((line) => !HEADING_RE.test(line)).join('\n')
  )
  const filename = name
    .split('/')
    .pop()
    .replace(/\.md$/, '')
    .replaceAll(/-/g, ' ')

  return { name, filename, headings, body }
}

function cleanLine(line, maxLength = MAX_SNIPPET_LENGTH) {
  const cleaned = line
    .replace(/^#+\s*/, '')
    .replaceAll(/\|/g, ' ')
    .replaceAll(/\*\*?([^*]+)\*\*?/g, '$1')
    .replaceAll(/`[^`]+`/g, '')
    .replaceAll(/\s+/g, ' ')
    .trim()
  return cleaned.length > maxLength
    ? cleaned.slice(0, maxLength).replace(/\s\S*$/, '') + '…'
    : cleaned
}

function headingAbove(lines, fromIndex) {
  for (let i = fromIndex; i >= 0; i--) {
    if (HEADING_RE.test(lines[i])) {
      return lines[i].replace(/^#+\s*/, '')
    }
  }
  return null
}

function processLine(line, lines, lineIndex, queryLower, seenHeadings) {
  if (!line.toLowerCase().includes(queryLower)) {
    return null
  }

  const isHeading = HEADING_RE.test(line)
  const snippet = cleanLine(line)

  if (!snippet) {
    return null
  }

  const heading = isHeading ? null : headingAbove(lines, lineIndex)

  // Skip body lines under a heading already shown as a heading match
  if (!isHeading && heading && seenHeadings.has(heading)) {
    return null
  }

  if (isHeading) {
    seenHeadings.add(snippet)
  }

  const anchorSource = isHeading ? snippet : heading
  const anchor = anchorSource ? headingToAnchor(anchorSource) : null

  return { snippet, heading, anchor }
}

function findAllOccurrences(
  rawFile,
  query,
  maxPerDoc = MAX_OCCURRENCES_PER_DOC
) {
  const lines = rawFile.split('\n')
  const queryLower = query.toLowerCase()
  const results = []
  const seenHeadings = new Set()

  for (let i = 0; i < lines.length && results.length < maxPerDoc; i++) {
    const result = processLine(lines[i], lines, i, queryLower, seenHeadings)
    if (result) {
      results.push(result)
    }
  }

  return results
}

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
        content.Key.endsWith('.md') && !shouldExcludedItem(content.Key)
    )

    const fetchMarkdownPromises = mdFiles.map(async (content) => {
      const key = content.Key

      const s3response = await fetchS3File(request, key, bucket)
      const mdFile = await s3response.Body.transformToString()

      return {
        name: key,
        rawFile: mdFile
      }
    })

    store.files = await Promise.all(fetchMarkdownPromises)

    const parsedDocs = await Promise.all(
      store.files.map((file) => parseDocument(file.name, file.rawFile))
    )

    store.index = lunr(function () {
      this.ref('name')
      this.field('filename', { boost: 10 })
      this.field('headings', { boost: 5 })
      this.field('body', { boost: 1 })
      this.metadataWhitelist = ['position'] // https://github.com/olivernn/moonwalkers/blob/6d5a6e976921490033681617e92ea42e3a80eed0/build-index#L23-L29

      for (const doc of parsedDocs) {
        this.add(doc)
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
        `${queryTerm}^100 ${queryTerm}*^50 *${queryTerm}^25 ${queryTerm.slice(0, 15)}~4`
      )
    : []

  const searchSuggestions = results.flatMap((result) => {
    const match = builtSearchIndex.files.find(
      (file) => file.name === result.ref
    )
    if (!match) {
      return [{ value: result.ref, text: result.ref }]
    }

    const occurrences = findAllOccurrences(match.rawFile, queryTerm)
    if (occurrences.length === 0) {
      return [{ value: result.ref, text: result.ref }]
    }

    return occurrences.map(({ snippet, heading, anchor }) => ({
      value: result.ref,
      text: snippet,
      ...(heading ? { hint: heading } : {}),
      ...(anchor ? { anchor } : {})
    }))
  })

  const endPrepareResults = performance.now()
  request.logger.debug(
    `Results prep took ${endPrepareResults - startPrepareResults} milliseconds`
  )

  return searchSuggestions
}

export {
  searchIndex,
  buildSearchIndex,
  parseDocument,
  stripMarkdown,
  findAllOccurrences
}
