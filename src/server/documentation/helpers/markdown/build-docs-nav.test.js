import { buildDocsNav } from '~/src/server/documentation/helpers/markdown/build-docs-nav.js'
import { fetchMarkdown } from '~/src/server/documentation/helpers/s3-file-handler.js'

jest.mock('~/src/server/documentation/helpers/s3-file-handler.js')

describe('buildDocsNav', () => {
  const mockNavMarkdown = `
  - [CDP](/README.md)
    - [Onboarding](/onboarding/README.md)`.trim()

  let request
  let bucket
  let documentationPath

  beforeEach(() => {
    request = {
      logger: {
        debug: jest.fn()
      }
    }
    bucket = 'mock-bucket'
    documentationPath = 'README.md'
  })

  test('Should return parsed markdown with nav link extension', async () => {
    const expectedNavHtml = `<ul>
<li><a class="app-link is-active" href="/documentation/README.md">CDP</a><ul>
<li><a class="app-link" href="/documentation/onboarding/README.md">Onboarding</a></li>
</ul>
</li>
</ul>`.trim()

    fetchMarkdown.mockResolvedValue(mockNavMarkdown)

    const result = await buildDocsNav(request, bucket, documentationPath)

    expect(fetchMarkdown).toHaveBeenCalledWith(request, bucket, 'nav.md')
    expect(result.trim()).toBe(expectedNavHtml)
  })

  test('Should handle errors when fetching markdown', async () => {
    fetchMarkdown.mockRejectedValue(new Error('Failed to fetch markdown'))

    await expect(
      buildDocsNav(request, bucket, documentationPath)
    ).rejects.toThrow('Failed to fetch markdown')
    expect(fetchMarkdown).toHaveBeenCalledWith(request, bucket, 'nav.md')
  })
})
