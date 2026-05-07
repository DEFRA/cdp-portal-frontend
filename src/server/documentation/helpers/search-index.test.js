import lunr from 'lunr'

import {
  searchIndex,
  parseDocument,
  stripMarkdown,
  findAllOccurrences
} from './search-index.js'
import {
  fetchS3File,
  fetchHeadObject,
  fetchListObjects
} from './s3-file-handler.js'

vi.mock('lunr')
vi.mock('./s3-file-handler.js')

const mockLunr = ({ ref, field, add }) => {
  const mockIndex = {
    ref,
    field,
    add,
    search: vi.fn().mockReturnValue([{ ref: 'test.md', score: 1 }])
  }

  vi.mocked(lunr).mockImplementationOnce((config) => {
    config.call(mockIndex)
    return mockIndex
  })
}

const mockS3Response = (mockMarkdownFile) => {
  fetchHeadObject.mockResolvedValue({ LastModified: new Date() })
  fetchListObjects.mockResolvedValue({ Contents: [mockMarkdownFile] })
  fetchS3File.mockResolvedValue(mockMarkdownFile)
}

describe('#stripMarkdown', () => {
  test('Should strip fenced code block syntax but keep code content searchable', async () => {
    const input = 'Intro text\n```js\nconst x = 1\n```\nTrailing text'
    const result = await stripMarkdown(input)
    expect(result).toContain('const x = 1')
    expect(result).not.toContain('```')
  })
})

describe('#parseDocument', () => {
  test('Should not strip ".md" from mid-string filename segments', async () => {
    const result = await parseDocument('my.md.notes.md', '# Title\nbody text')
    expect(result.filename).toBe('my.md.notes')
  })

  test('Should not treat #hashtags in body text as headings', async () => {
    const result = await parseDocument(
      'guide.md',
      '# Real Heading\nuse #tag1 and #tag2 to categorise'
    )
    expect(result.headings).toBe('Real Heading')
    expect(result.body).toContain('#tag1')
    expect(result.body).toContain('#tag2')
  })

  test('Should not treat deeply-nested hashtags like #tag as headings', async () => {
    const result = await parseDocument('guide.md', '#tag1\n## Section\nbody')
    expect(result.headings).toBe('Section')
    expect(result.body).toContain('#tag1')
  })
})

describe('#findAllOccurrences', () => {
  test('Should return a result for a basic body match with no heading above it', () => {
    const results = findAllOccurrences('SQS handles messaging', 'SQS')
    expect(results).toEqual([
      { snippet: 'SQS handles messaging', heading: null, anchor: null }
    ])
  })

  test('Should set heading to the section above a matching body line', () => {
    const results = findAllOccurrences(
      '## Overview\nbody text with SQS in it',
      'SQS'
    )
    expect(results).toEqual([
      {
        snippet: 'body text with SQS in it',
        heading: 'Overview',
        anchor: 'overview'
      }
    ])
  })

  test('Should return anchor derived from heading text when heading matches', () => {
    const results = findAllOccurrences('## SQS Queues\nsome body', 'SQS')
    expect(results).toEqual([
      { snippet: 'SQS Queues', heading: null, anchor: 'sqs-queues' }
    ])
  })

  test('Should deduplicate body lines under an already-matched heading', () => {
    const results = findAllOccurrences(
      '## SQS Queues\nSQS handles messaging',
      'SQS'
    )
    expect(results).toEqual([
      { snippet: 'SQS Queues', heading: null, anchor: 'sqs-queues' }
    ])
  })

  test('Should respect maxPerDoc limit', () => {
    const rawFile = Array.from(
      { length: 10 },
      (_, i) => `line ${i} has the word`
    ).join('\n')
    const results = findAllOccurrences(rawFile, 'word', 2)
    expect(results).toHaveLength(2)
  })

  test('Should match case-insensitively', () => {
    const results = findAllOccurrences('## SQS Queues', 'sqs')
    expect(results).toEqual([
      { snippet: 'SQS Queues', heading: null, anchor: 'sqs-queues' }
    ])
  })

  test('Should return empty array when there are no matches', () => {
    const results = findAllOccurrences('## SQS Queues', 'blah')
    expect(results).toEqual([])
  })

  test('Should strip GFM alert markers from snippets', () => {
    const rawFile = '> [!IMPORTANT]\n> This is important content'
    const results = findAllOccurrences(rawFile, 'important')
    expect(
      results.every(({ snippet }) => !snippet.includes('[!IMPORTANT]'))
    ).toBe(true)
  })

  test('Should not treat #hashtag lines as headings', () => {
    const results = findAllOccurrences('#tag1\nsome body with tag1', 'tag1')
    expect(results).toEqual([
      { snippet: 'tag1', heading: null, anchor: null },
      { snippet: 'some body with tag1', heading: null, anchor: null }
    ])
  })
})

describe('#searchIndex', () => {
  const mockMarkdownContent = '# Test Markdown Content'
  const mockMarkdownFile = {
    Key: 'test.md',
    Body: {
      transformToString: vi.fn().mockResolvedValue(mockMarkdownContent)
    }
  }
  const mockRef = vi.fn()
  const mockField = vi.fn()
  const mockAdd = vi.fn()
  let request
  let bucket
  let query

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-02-21'))

    request = {
      logger: {
        debug: vi.fn()
      }
    }
    bucket = 'test-bucket'
    query = 'test'
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  test('Should return empty array if no markdown files are found', async () => {
    fetchHeadObject.mockResolvedValue({ LastModified: new Date() })
    fetchListObjects.mockResolvedValue({ Contents: [] })

    const result = await searchIndex(request, bucket, query)

    expect(result).toEqual([])
    expect(request.logger.debug).toHaveBeenCalledWith(
      'Fetching docs from S3 due to new data'
    )
  })

  test('Should return search suggestions for a valid query', async () => {
    mockS3Response(mockMarkdownFile)

    mockLunr({ ref: mockRef, field: mockField, add: mockAdd })

    const result = await searchIndex(request, bucket, query)

    expect(mockRef).toHaveBeenCalledWith('name')
    expect(mockField).toHaveBeenNthCalledWith(1, 'filename', { boost: 10 })
    expect(mockField).toHaveBeenNthCalledWith(2, 'headings', { boost: 5 })
    expect(mockField).toHaveBeenNthCalledWith(3, 'body', { boost: 1 })
    expect(mockAdd).toHaveBeenCalledWith({
      name: 'test.md',
      filename: 'test',
      headings: 'Test Markdown Content',
      body: ''
    })

    expect(result).toEqual([
      {
        value: 'test.md',
        text: 'Test Markdown Content',
        anchor: 'test-markdown-content'
      }
    ])
    expect(request.logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Search index build took')
    )
  })

  test('Should return one occurrence per matching line with heading as hint', async () => {
    const mockMultilineFile = {
      Key: 'test.md',
      Body: {
        transformToString: vi
          .fn()
          .mockResolvedValue(
            '# Overview\nsome content with test here\nanother test line'
          )
      }
    }
    mockS3Response(mockMultilineFile)
    fetchHeadObject.mockResolvedValue({ LastModified: new Date('2025-02-22') })
    mockLunr({ ref: mockRef, field: mockField, add: mockAdd })

    const result = await searchIndex(request, bucket, 'test')
    expect(result).toEqual([
      {
        value: 'test.md',
        text: 'some content with test here',
        hint: 'Overview',
        anchor: 'overview'
      },
      {
        value: 'test.md',
        text: 'another test line',
        hint: 'Overview',
        anchor: 'overview'
      }
    ])
  })

  test('Should return matched line with no hint when no heading present', async () => {
    const mockMarkdownWithoutHeading = {
      Key: 'test.md',
      Body: {
        transformToString: vi
          .fn()
          .mockResolvedValue('plain body text with test')
      }
    }
    mockS3Response(mockMarkdownWithoutHeading)
    fetchHeadObject.mockResolvedValue({ LastModified: new Date('2025-02-23') })

    mockLunr({ ref: mockRef, field: mockField, add: mockAdd })

    const result = await searchIndex(request, bucket, 'test')
    expect(result).toEqual([
      {
        value: 'test.md',
        text: 'plain body text with test'
      }
    ])
  })
})
