import { describe, expect, test, vi } from 'vitest'
import { fetchS3File } from './s3-file-handler.js'
import { documentationStructure } from './documentation-structure.js'

vi.mock('@aws-sdk/client-s3')
vi.mock('./s3-file-handler')

const provideMarkdown = (markdown) => ({
  Body: {
    transformToString: vi.fn().mockResolvedValue(markdown)
  }
})

describe('#directoryStructure', () => {
  const mockRequest = {
    s3Client: {
      send: vi.fn()
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
      { text: 'CDP', href: '/documentation/README.md', level: 0 },
      { text: 'Guides', href: '/documentation/guides/README.md', level: 1 },
      {
        text: 'Getting Started',
        href: '/documentation/guides/getting-started.md',
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
        href: '/documentation/README.md',
        level: 0,
        text: 'CDP'
      },
      {
        href: '/documentation/guides/README.md',
        level: 1,
        text: 'Guides'
      },
      {
        href: '/documentation/guides/advanced/README.md',
        level: 2,
        text: 'Advanced'
      },
      {
        href: '/documentation/guides/advanced/topics.md',
        level: 3,
        text: 'Topics'
      },
      {
        href: '/documentation/how-to/README.md',
        level: 1,
        text: 'How To'
      },
      {
        href: '/documentation/how-to/long-process/README.md',
        level: 2,
        text: 'Long Process'
      },
      {
        href: '/documentation/how-to/long-process/node.md',
        level: 3,
        text: 'Node'
      },
      {
        href: '/documentation/how-to/long-process/dotnet.md',
        level: 3,
        text: 'Dotnet'
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
