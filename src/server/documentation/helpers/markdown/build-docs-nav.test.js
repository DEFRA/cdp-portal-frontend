import { load } from 'cheerio'

import { buildDocsNav } from '~/src/server/documentation/helpers/markdown/build-docs-nav'
import { documentationStructure } from '~/src/server/documentation/helpers/documentation-structure'

jest.mock('~/src/server/documentation/helpers/documentation-structure')

describe('#buildDocsNav', () => {
  const mockRequest = {
    path: '/documentation/guides/getting-started.md'
  }
  const mockBucket = 'mock-bucket'

  test('Should provide expected navigation', async () => {
    documentationStructure.mockResolvedValue([
      { text: 'Documentation', href: '/documentation/README.md', level: 0 },
      { text: 'Guides', href: '/documentation/guides/README.md', level: 1 },
      {
        text: 'Getting Started',
        href: '/documentation/guides/getting-started.md',
        level: 2
      }
    ])

    const html = await buildDocsNav(mockRequest, mockBucket)
    const $html = load(html)
    const $link1 = $html('ul').first().find('a').first()
    const $link2 = $html('ul > li > ul').find('a').first()
    const $link3 = $html('ul > li > ul > li > ul').find('a').first()

    expect($link1.text()).toBe('Documentation')
    expect($link1.attr('href')).toBe('/documentation/README.md')

    expect($link2.text()).toBe('Guides')
    expect($link2.attr('href')).toBe('/documentation/guides/README.md')

    expect($link3.text()).toBe('Getting Started')
    expect($link3.attr('href')).toBe('/documentation/guides/getting-started.md')
  })

  test('should handle an empty directory structure', async () => {
    documentationStructure.mockResolvedValue([])

    const result = await buildDocsNav(mockRequest, mockBucket)

    expect(result).toBe('')
  })

  test('Should handle multiple levels as expected', async () => {
    documentationStructure.mockResolvedValue([
      { text: 'Documentation', href: '/documentation/README.md', level: 0 },
      { text: 'Guides', href: '/documentation/guides/README.md', level: 1 },
      {
        text: 'Advanced',
        href: '/documentation/guides/advanced/README.md',
        level: 2
      },
      {
        text: 'Topics',
        href: '/documentation/guides/advanced/topics.md',
        level: 3
      }
    ])

    const html = await buildDocsNav(mockRequest, mockBucket)
    const $html = load(html)
    const $link1 = $html('ul').first().find('a').first()
    const $link2 = $html('ul > li > ul').find('a').first()
    const $link3 = $html('ul > li > ul > li > ul').find('a').first()
    const $link4 = $html('ul > li > ul > li > ul > li > ul').find('a').first()

    expect($link1.text()).toBe('Documentation')
    expect($link1.attr('href')).toBe('/documentation/README.md')

    expect($link2.text()).toBe('Guides')
    expect($link2.attr('href')).toBe('/documentation/guides/README.md')

    expect($link3.text()).toBe('Advanced')
    expect($link3.attr('href')).toBe('/documentation/guides/advanced/README.md')

    expect($link4.text()).toBe('Topics')
    expect($link4.attr('href')).toBe('/documentation/guides/advanced/topics.md')
  })

  test('Should mark the current path as active', async () => {
    documentationStructure.mockResolvedValue([
      { text: 'Documentation', href: '/documentation/README.md', level: 0 },
      { text: 'Guides', href: '/documentation/guides/README.md', level: 1 },
      {
        text: 'Getting Started',
        href: '/documentation/guides/getting-started.md',
        level: 2
      }
    ])

    const html = await buildDocsNav(mockRequest, mockBucket)
    const $html = load(html)
    const $link1 = $html('ul').first().find('a').first()
    const $link2 = $html('ul > li > ul').find('a').first()
    const $link3 = $html('ul > li > ul > li > ul').find('a').first()

    expect($link1.attr('class')).toBe('app-link')
    expect($link2.attr('class')).toBe('app-link')
    expect($link3.attr('class')).toBe('app-link is-active')
  })
})
