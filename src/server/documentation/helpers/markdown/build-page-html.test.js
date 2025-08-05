import { load } from 'cheerio'

import { buildPageHtml } from './build-page-html.js'

describe('#buildPageHtml', () => {
  const searchTerm = ''

  test('Should convert markdown to HTML', async () => {
    const markdown = '# Heading\n\nThis is a paragraph.'
    const mockRequest = { query: { q: searchTerm } }
    const { html } = await buildPageHtml(mockRequest, markdown)

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

  test('Should not add search term highlight on excluded elements', async () => {
    const searchTerm = 'fetch'
    const mockRequest = { query: { q: searchTerm } }
    const markdown =
      '# Fetch\n\n `inline fetch example` \n ```and this is a fetch code example``` \n [fetch](/fetch-in-url)'
    const { html } = await buildPageHtml(mockRequest, markdown)

    const $html = load(html)

    expect($html('h1').prop('id')).toBe('fetch')
    expect($html('h1 a').prop('href')).toBe('#fetch')
    expect($html('h1 a').html()).toBe('<mark class="app-mark">Fetch</mark>')

    expect($html('p code:first').text()).toBe('inline fetch example')
    expect($html('p code:last').text()).toBe('and this is a fetch code example')
    expect($html('p a').prop('href')).toBe('/fetch-in-url')
    expect($html('p a').html()).toBe('<mark class="app-mark">fetch</mark>')
  })

  test('Should escape search term containing regex characters', async () => {
    const searchTerm = 'file that sets up Pino (the log'
    const mockRequest = { query: { q: searchTerm } }
    const markdown =
      'Templated node projects should have a `logger-options.js` file that sets up Pino (the log library).'
    const { html } = await buildPageHtml(mockRequest, markdown)

    const $html = load(html)

    expect($html('p').html()).toBe(
      `Templated node projects should have a <code>logger-options.js</code> <mark class="app-mark">file that sets up Pino (the log</mark> library).`
    )
  })

  test('Should generate expected table of contents', async () => {
    const markdown = '# Heading 1\n\n## Heading 2\n\n### Heading 3'
    const mockRequest = { query: { q: searchTerm } }
    const { toc } = await buildPageHtml(mockRequest, markdown)

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
    const mockRequest = { query: { q: searchTerm } }
    const { html, toc } = await buildPageHtml(mockRequest, '')

    expect(html).toBe('')
    expect(toc).toBe('')
  })

  test('Should render angle bracket link as expected', async () => {
    const mockRequest = { query: {} }
    const markdown = '<https://example.com>'
    const { html } = await buildPageHtml(mockRequest, markdown)

    const $html = load(html)
    const $link = $html('a')

    expect($link.prop('outerHTML')).toBe(
      '<a href="https://example.com" target="_blank" rel="noopener noreferrer">https://example.com</a>'
    )
  })

  test('Should render plain link as expected', async () => {
    const mockRequest = { query: {} }
    const markdown = 'https://exampleother.com'
    const { html } = await buildPageHtml(mockRequest, markdown)

    const $html = load(html)
    const $link = $html('a')

    expect($link.prop('outerHTML')).toBe(
      '<a href="https://exampleother.com" target="_blank" rel="noopener noreferrer">https://exampleother.com</a>'
    )
  })

  test('Should render markdown link as expected', async () => {
    const mockRequest = { query: {} }
    const markdown =
      '[https://example-another.com](https://example-another.com)'
    const { html } = await buildPageHtml(mockRequest, markdown)

    const $html = load(html)
    const $link = $html('a')

    expect($link.prop('outerHTML')).toBe(
      '<a href="https://example-another.com" target="_blank" rel="noopener noreferrer">https://example-another.com</a>'
    )
  })
})
