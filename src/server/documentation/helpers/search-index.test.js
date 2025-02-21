import lunr from 'lunr'

import { searchIndex } from '~/src/server/documentation/helpers/search-index.js'
import {
  fetchS3File,
  fetchHeadObject,
  fetchListObjects
} from '~/src/server/documentation/helpers/s3-file-handler.js'

jest.mock('lunr')
jest.mock('~/src/server/documentation/helpers/s3-file-handler.js')

const mockLunr = ({ ref, field, add }) => {
  const mockIndex = {
    ref,
    field,
    add,
    search: jest.fn().mockReturnValue([
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

  jest.mocked(lunr).mockImplementationOnce((config) => {
    config.call(mockIndex)
    return mockIndex
  })
}

describe('#searchIndex', () => {
  const mockMarkdownContent = '# Test Markdown Content'
  const mockMarkdownFile = {
    Key: 'test.md',
    Body: {
      transformToString: jest.fn().mockResolvedValue(mockMarkdownContent)
    }
  }
  const mockRef = jest.fn()
  const mockField = jest.fn()
  const mockAdd = jest.fn()
  let request
  let bucket
  let query

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-02-21'))

    request = {
      logger: {
        debug: jest.fn()
      }
    }
    bucket = 'test-bucket'
    query = 'test'
  })

  afterAll(() => {
    jest.useRealTimers()
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
    fetchHeadObject.mockResolvedValue({ LastModified: new Date() })
    fetchListObjects.mockResolvedValue({ Contents: [mockMarkdownFile] })
    fetchS3File.mockResolvedValue(mockMarkdownFile)

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
})
