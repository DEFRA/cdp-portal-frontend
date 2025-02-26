import { load } from 'cheerio'

import { buildPageHtml } from '~/src/server/documentation/helpers/markdown/build-page-html.js'

describe('#buildPageHtml', () => {
  const searchTerm = ''

  test('Should convert markdown to HTML', async () => {
    const markdown = '# Heading\n\nThis is a paragraph.'
    const { html } = await buildPageHtml(searchTerm, markdown)

    const $html = load(html)
    const $heading = $html('h1')
    const $headingAnchor = $heading.find('a')
    const $paragraph = $html('p')

    expect($heading).toHaveLength(1)

    expect($headingAnchor.attr('href')).toBe('#heading')
    expect($headingAnchor.text()).toContain('Heading')

    expect($paragraph.text()).toBe('This is a paragraph.')
  })

  test('Should highlight search term', async () => {
    const searchTerm = 'paragraph'
    const mockRequest = { query: { q: searchTerm } }
    const markdown = '# Heading\n\nThis is a paragraph.'
    const { html } = await buildPageHtml(mockRequest, markdown)

    const $html = load(html)
    const $paragraph = $html('p')

    expect($paragraph.html()).toBe(
      'This is a <mark class="app-mark">paragraph</mark>.'
    )
  })

  test('Should generate expected table of contents', async () => {
    const markdown = '# Heading 1\n\n## Heading 2\n\n### Heading 3'
    const { toc } = await buildPageHtml(searchTerm, markdown)

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
    const { html, toc } = await buildPageHtml(searchTerm, '')

    expect(html).toBe('')
    expect(toc).toBe('')
  })
})
