import fs from 'node:fs'
import path from 'node:path'
import { load } from 'cheerio'

import { buildBlogNav } from './build-blog-nav.js'
import { fetchMarkdown } from '../../../documentation/helpers/s3-file-handler.js'

vi.mock('../../../documentation/helpers/s3-file-handler.js')

describe('#buildBlogNav', () => {
  test('Should provide expected blog navigation', async () => {
    fetchMarkdown.mockResolvedValueOnce?.(
      fs.readFileSync(
        path.resolve(
          import.meta.dirname,
          '..',
          '..',
          '..',
          '..',
          '__fixtures__',
          'blog',
          'blog-nav.md'
        ),
        'utf8'
      )
    )

    const { nav, navHrefs } = await buildBlogNav({}, 'mock-bucket')

    const $html = load(nav)
    const $firstLink = $html('a').first()

    expect($firstLink.text()).toBe('Passing profile to the test suite')
    expect($firstLink.attr('class')).toBe('app-link')
    expect($firstLink.attr('href')).toBe(
      '/blog/20251024-passing-profile-to-the-test-suite.md'
    )

    const $secondLink = $html('a').eq(1)

    expect($secondLink.text()).toBe('Introducing the CDP blog')
    expect($secondLink.attr('class')).toBe('app-link')
    expect($secondLink.attr('href')).toBe(
      '/blog/20251017-introducing-the-cdp-blog.md'
    )

    expect(navHrefs).toEqual([
      '/blog/20251024-passing-profile-to-the-test-suite.md',
      '/blog/20251017-introducing-the-cdp-blog.md'
    ])
  })
})
