import { load } from 'cheerio'

import {
  buildDocsPageHtml,
  extractTagsFromMarkdown,
  extractHrefs
} from './build-page-html.js'

describe('#buildDocsPageHtml', () => {
  test('Should convert markdown to HTML', async () => {
    const markdown = '# Heading\n\nThis is a paragraph.'
    const { html } = await buildDocsPageHtml(markdown)

    const $html = load(html)
    const $heading = $html('h1')
    const $headingAnchor = $heading.find('a')
    const $paragraph = $html('p')

    expect($heading).toHaveLength(1)

    expect($headingAnchor.attr('href')).toBe('#heading')
    expect($headingAnchor.text()).toContain('Heading')

    expect($paragraph.text()).toBe('This is a paragraph.')
  })

  test('Should generate expected table of contents', async () => {
    const markdown = '# Heading 1\n\n## Heading 2\n\n### Heading 3'
    const { toc } = await buildDocsPageHtml(markdown)

    const $toc = load(toc)
    const $link1 = $toc('ul').first().find('a').first()
    const $link2 = $toc('ul > li > ul').find('a').first()
    const $link3 = $toc('ul > li > ul > li > ul').find('a').first()

    expect($link1.text()).toBe('Heading 1')
    expect($link1.attr('href')).toBe('#heading-1')

    expect($link2.text()).toBe('Heading 2')
    expect($link2.attr('href')).toBe('#heading-2')

    expect($link3.text()).toBe('Heading 3')
    expect($link3.attr('href')).toBe('#heading-3')
  })

  test('Should handle empty markdown input', async () => {
    const { html, toc } = await buildDocsPageHtml('')

    expect(html).toBe('')
    expect(toc).toBe('')
  })

  test('Should render angle bracket link as expected', async () => {
    const markdown = '<https://example.com>'
    const { html } = await buildDocsPageHtml(markdown)

    const $html = load(html)
    const $link = $html('a')

    expect($link.prop('outerHTML')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">https://example.com</a>'
    )
  })

  test('Should render plain link as expected', async () => {
    const markdown = 'https://exampleother.com'
    const { html } = await buildDocsPageHtml(markdown)

    const $html = load(html)
    const $link = $html('a')

    expect($link.prop('outerHTML')).toBe(
      '<a href="https://exampleother.com" target="_blank" rel="noopener noreferrer">https://exampleother.com</a>'
    )
  })

  test('Should render markdown link as expected', async () => {
    const markdown =
      '[https://example-another.com](https://example-another.com)'
    const { html } = await buildDocsPageHtml(markdown)

    const $html = load(html)
    const $link = $html('a')

    expect($link.prop('outerHTML')).toBe(
      '<a href="https://example-another.com" target="_blank" rel="noopener noreferrer">https://example-another.com</a>'
    )
  })
})

describe('#extractTagsFromMarkdown', () => {
  test('Should extract tags from Labels comment', () => {
    const markdown = '<!-- Labels: NEW FEATURE, UPDATE -->\n\n# Heading'
    const tags = extractTagsFromMarkdown(markdown)

    expect(tags).toEqual(['NEW FEATURE', 'UPDATE'])
  })

  test('Should return empty array when no comment exists', () => {
    const markdown = '# Heading\n\nSome content'
    const tags = extractTagsFromMarkdown(markdown)

    expect(tags).toEqual([])
  })

  test('Should return empty array when no Labels in comment', () => {
    const markdown = '<!-- Some other comment -->\n\n# Heading'
    const tags = extractTagsFromMarkdown(markdown)

    expect(tags).toEqual([])
  })

  test('Should trim whitespace from tags', () => {
    const markdown = '<!-- Labels:   ACTION REQUIRED  ,  BUG FIX   -->'
    const tags = extractTagsFromMarkdown(markdown)

    expect(tags).toEqual(['ACTION REQUIRED', 'BUG FIX'])
  })

  test('Should handle single tag', () => {
    const markdown = '<!-- Labels: RELEASE -->'
    const tags = extractTagsFromMarkdown(markdown)

    expect(tags).toEqual(['RELEASE'])
  })
})

describe('#extractHrefs', () => {
  test('Should extract hrefs from markdown links', () => {
    const markdown = '[Link 1](/path/one)\n[Link 2](/path/two)'
    const hrefs = extractHrefs(markdown)

    expect(hrefs).toEqual(['/path/one', '/path/two'])
  })

  test('Should return empty array when no links exist', () => {
    const markdown = '# Heading\n\nSome content without links'
    const hrefs = extractHrefs(markdown)

    expect(hrefs).toEqual([])
  })
})
