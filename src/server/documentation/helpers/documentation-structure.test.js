import { fetchS3File } from '~/src/server/documentation/helpers/s3-file-handler'
import { documentationStructure } from '~/src/server/documentation/helpers/documentation-structure'

jest.mock('@aws-sdk/client-s3')
jest.mock('~/src/server/documentation/helpers/s3-file-handler')

const provideMarkdown = (markdown) => ({
  Body: {
    transformToString: jest.fn().mockResolvedValue(markdown)
  }
})

describe('#directoryStructure', () => {
  const mockRequest = {
    s3Client: {
      send: jest.fn()
    }
  }
  const mockBucket = 'mock-documentation-bucket'

  test('Should return the expected directory structure', async () => {
    // Alphabetically sorted list S3 objects mock response
    mockRequest.s3Client.send.mockResolvedValue({
      Contents: [
        { Key: 'README.md' },
        { Key: 'guides/README.md' },
        { Key: 'guides/getting-started.md' }
      ]
    })

    fetchS3File.mockImplementation((request, key) => {
      if (key === 'README.md') {
        return provideMarkdown(
          '# Documentation\n ## Guides\n[Guides](guides/README.md)'
        )
      }

      if (key === 'guides/README.md') {
        return provideMarkdown(
          '# Guides\n ## Getting Started\n[Getting Started](getting-started.md)'
        )
      }
    })

    const result = await documentationStructure(mockRequest, mockBucket)

    expect(result).toEqual([
      { text: 'Documentation', anchor: '/documentation/README.md', level: 0 },
      { text: 'Guides', anchor: '/documentation/guides/README.md', level: 1 },
      {
        text: 'Getting Started',
        anchor: '/documentation/guides/getting-started.md',
        level: 2
      }
    ])
  })

  test('Should handle sections and sort files as expected', async () => {
    // Alphabetically sorted list S3 objects mock response
    mockRequest.s3Client.send.mockResolvedValue({
      Contents: [
        { Key: 'README.md' },
        { Key: 'guides/README.md' },
        { Key: 'guides/advanced/README.md' },
        { Key: 'guides/advanced/topics.md' },
        { Key: 'how-to/README.md' },
        { Key: 'how-to/long-process/README.md' },
        { Key: 'how-to/long-process/dotnet.md' },
        { Key: 'how-to/long-process/node.md' }
      ]
    })

    fetchS3File.mockImplementation((request, key) => {
      if (key === 'README.md') {
        return provideMarkdown(
          '# Documentation\n ## Guides\n[Guides](guides/README.md)\n ## How To\n[How To](how-to/README.md)'
        )
      }

      if (key === 'guides/README.md') {
        return provideMarkdown(
          '# Guides\n ## Advanced\n[Advanced](advanced/README.md)'
        )
      }

      if (key === 'guides/advanced/README.md') {
        return provideMarkdown('# Advanced\n ## Topics\n[Topics](topics.md)')
      }

      if (key === 'how-to/README.md') {
        return provideMarkdown(
          '# How To\n ## Long process\n[Long Process](long-process/README.md)'
        )
      }

      if (key === 'how-to/long-process/README.md') {
        return provideMarkdown(
          '# Long process\n ## Node\n[Node](node.md)\n ## Dotnet\n[Dotnet](dotnet.md)'
        )
      }
    })

    const result = await documentationStructure(mockRequest, mockBucket)

    expect(result).toEqual([
      {
        anchor: '/documentation/README.md',
        level: 0,
        text: 'Documentation'
      },
      {
        anchor: '/documentation/guides/README.md',
        level: 1,
        text: 'Guides'
      },
      {
        anchor: '/documentation/guides/advanced/README.md',
        level: 2,
        text: 'Guides Advanced'
      },
      {
        anchor: '/documentation/guides/advanced/topics.md',
        level: 3,
        text: 'Advanced Topics'
      },
      {
        anchor: '/documentation/how-to/README.md',
        level: 1,
        text: 'How To'
      },
      {
        anchor: '/documentation/how-to/long-process/README.md',
        level: 2,
        text: 'How To Long Process'
      },
      {
        anchor: '/documentation/how-to/long-process/node.md',
        level: 3,
        text: 'Long Process Node'
      },
      {
        anchor: '/documentation/how-to/long-process/dotnet.md',
        level: 3,
        text: 'Long Process Dotnet'
      }
    ])
  })

  describe('When no markdown files are found in S3', () => {
    test('Should return an empty array', async () => {
      // List S3 objects mock response
      mockRequest.s3Client.send.mockResolvedValue({ Contents: [] })

      const result = await documentationStructure(mockRequest, mockBucket)

      expect(result).toEqual([])
    })
  })
})
