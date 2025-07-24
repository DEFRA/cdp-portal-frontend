import { afterAll, beforeEach, describe, expect, test, vi } from 'vitest'
import lunr from 'lunr'

import { searchIndex } from './search-index.js'
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
    search: vi.fn().mockReturnValue([
      {
        ref: 'test.md',
        matchData: {
          metadata: {
            test: {
              file: {
                position: [[0, 4]]
              }
            }
          }
        }
      }
    ])
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
    expect(mockField).toHaveBeenCalledWith('file')
    expect(mockAdd).toHaveBeenCalledWith({
      name: 'test.md',
      file: 'Test Markdown Content'
    })

    expect(result).toEqual([
      {
        value: 'test.md',
        text: 'Test Markdown'
      }
    ])
    expect(request.logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Search index build took')
    )
  })

  test('Should return full match for matching query', async () => {
    mockS3Response(mockMarkdownFile)

    mockLunr({ ref: mockRef, field: mockField, add: mockAdd })

    const result = await searchIndex(request, bucket, 'Test Markdown Content')
    expect(result).toEqual([
      {
        value: 'test.md',
        text: 'Test Markdown Content'
      }
    ])
  })

  test('Should strip first and last words', async () => {
    mockS3Response(mockMarkdownFile)

    mockLunr({ ref: mockRef, field: mockField, add: mockAdd })

    const result = await searchIndex(request, bucket, 'markdo')
    expect(result).toEqual([
      {
        value: 'test.md',
        text: 'Markdown'
      }
    ])
  })

  test('Should provide expected result with query matching end of line', async () => {
    mockS3Response(mockMarkdownFile)

    mockLunr({ ref: mockRef, field: mockField, add: mockAdd })

    const result = await searchIndex(request, bucket, 'content')
    expect(result).toEqual([
      {
        value: 'test.md',
        text: 'Markdown Content'
      }
    ])
  })
})
